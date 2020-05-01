import path from "path";
import postcss from "postcss";
import valueParser from "postcss-value-parser";

import { normalizePath } from "../../../utils/path";

import resolveDefault, { Resolve } from "./resolve";

const name = "styles-import";

export type ImportOptions = {
  /**
   * Provide custom resolver for imports
   * in place of the default one
   */
  resolve?: Resolve;
  /**
   * Aliases for import paths.
   * Overrides the global `alias` option.
   * - ex.: `{"foo":"bar"}`
   */
  alias?: { [from: string]: string };
};

const plugin: postcss.Plugin<ImportOptions> = postcss.plugin(
  name,
  options => async (css, res): Promise<void> => {
    if (!css.source?.input.file) return;

    const resolve = options?.resolve ?? resolveDefault;
    const alias = options?.alias ?? {};

    const opts = res.opts
      ? {
          ...res.opts,
          map: typeof res.opts.map === "object" ? { ...res.opts.map, prev: false } : res.opts.map,
        }
      : {};

    const { file } = css.source.input;
    const importMap = new Map<postcss.AtRule, string>();
    const basedir = path.dirname(file);

    css.walkAtRules(/^import$/i, importRule => {
      // Top level only
      if (importRule.parent.type !== "root") {
        importRule.warn(res, "`@import` should be top level");
        return;
      }

      // Child nodes should not exist
      if (importRule.nodes) {
        importRule.warn(res, "`@import` was not terminated correctly");
        return;
      }

      const [urlNode] = valueParser(importRule.params).nodes;

      // No URL detected
      if (!urlNode || (urlNode.type !== "string" && urlNode.type !== "function")) {
        importRule.warn(res, `No URL in \`${importRule.toString()}\``);
        return;
      }

      let url = "";

      if (urlNode.type === "string") {
        url = urlNode.value;
      } else if (urlNode.type === "function") {
        // Invalid function
        if (urlNode.value.toLowerCase() !== "url") {
          importRule.warn(res, `Invalid \`url\` function in \`${importRule.toString()}\``);
          return;
        }

        const isString = urlNode.nodes[0]?.type === "string";
        url = isString ? urlNode.nodes[0].value : valueParser.stringify(urlNode.nodes);
      }

      url = url.replace(/^\s+|\s+$/g, "");

      // Resolve aliases
      Object.entries(alias).forEach(([from, to]) => {
        if (!url.startsWith(from)) return;
        url = normalizePath(to) + url.slice(from.length);
      });

      // Empty url
      if (url.length === 0) {
        importRule.warn(res, `Empty URL in \`${importRule.toString()}\``);
        return;
      }

      importMap.set(importRule, url);
    });

    for await (const [importRule, url] of importMap) {
      try {
        const { source, from } = await resolve(url, basedir);
        if (normalizePath(from) === normalizePath(file)) {
          importRule.warn(res, `\`@import\` loop in \`${importRule.toString()}\``);
          continue;
        }

        res.messages.push({ plugin: name, type: "dependency", file: from });

        const imported = await postcss(plugin(options)).process(source, { ...opts, from });
        res.messages.unshift(...imported.messages);

        if (!imported.root) importRule.remove();
        else importRule.replaceWith(imported.root);
      } catch (error) {
        importRule.warn(res, `Unresolved \`@import\` in \`${importRule.toString()}\``);
      }
    }
  },
);

export default plugin;
