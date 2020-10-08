import path from "path";
import postcss, { PluginCreator, Result, AtRule } from "postcss";
import valueParser from "postcss-value-parser";

import { normalizePath } from "../../../utils/path";

import resolveDefault, { ImportResolve } from "./resolve";

const name = "styles-import";
const extensionsDefault = [".css", ".pcss", ".postcss", ".sss"];

/** `@import` handler options */
export interface ImportOptions {
  /**
   * Provide custom resolver for imports
   * in place of the default one
   */
  resolve?: ImportResolve;
  /**
   * Aliases for import paths.
   * Overrides the global `alias` option.
   * - ex.: `{"foo":"bar"}`
   */
  alias?: Record<string, string>;
  /**
   * Import files ending with these extensions.
   * Overrides the global `extensions` option.
   * @default [".css", ".pcss", ".postcss", ".sss"]
   */
  extensions?: string[];
}

const plugin: PluginCreator<ImportOptions> = (options = {}) => {
  const resolve = options.resolve ?? resolveDefault;
  const alias = options.alias ?? {};
  const extensions = options.extensions ?? extensionsDefault;

  return {
    postcssPlugin: name,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async Once(css, { result: res }) {
      if (!css.source?.input.file) return;

      const opts: Result["opts"] = { ...res.opts };
      delete opts.map;

      const { file } = css.source.input;
      const importList: { rule: AtRule; url: string }[] = [];
      const basedir = path.dirname(file);

      css.walkAtRules(/^import$/i, rule => {
        // Top level only
        if (rule.parent && rule.parent.type !== "root") {
          rule.warn(res, "`@import` should be top level");
          return;
        }

        // Child nodes should not exist
        if (rule.nodes) {
          rule.warn(res, "`@import` was not terminated correctly");
          return;
        }

        const [urlNode] = valueParser(rule.params).nodes;

        // No URL detected
        if (!urlNode || (urlNode.type !== "string" && urlNode.type !== "function")) {
          rule.warn(res, `No URL in \`${rule.toString()}\``);
          return;
        }

        let url = "";

        if (urlNode.type === "string") {
          url = urlNode.value;
        } else if (urlNode.type === "function") {
          // Invalid function
          if (!/^url$/i.test(urlNode.value)) {
            rule.warn(res, `Invalid \`url\` function in \`${rule.toString()}\``);
            return;
          }

          const isString = urlNode.nodes[0]?.type === "string";
          url = isString ? urlNode.nodes[0].value : valueParser.stringify(urlNode.nodes);
        }

        url = url.replace(/^\s+|\s+$/g, "");

        // Resolve aliases
        for (const [from, to] of Object.entries(alias)) {
          if (!url.startsWith(from)) continue;
          url = normalizePath(to) + url.slice(from.length);
        }

        // Empty url
        if (url.length === 0) {
          rule.warn(res, `Empty URL in \`${rule.toString()}\``);
          return;
        }

        importList.push({ rule, url });
      });

      for await (const { rule, url } of importList) {
        try {
          const { source, from } = await resolve(url, basedir, extensions);

          if (!(source instanceof Uint8Array) || typeof from !== "string") {
            rule.warn(res, `Incorrectly resolved \`@import\` in \`${rule.toString()}\``);
            continue;
          }

          if (normalizePath(from) === normalizePath(file)) {
            rule.warn(res, `\`@import\` loop in \`${rule.toString()}\``);
            continue;
          }

          const imported = await postcss(plugin(options)).process(source, { ...opts, from });
          res.messages.push(...imported.messages, { plugin: name, type: "dependency", file: from });

          if (!imported.root) rule.remove();
          else rule.replaceWith(imported.root);
        } catch {
          rule.warn(res, `Unresolved \`@import\` in \`${rule.toString()}\``);
        }
      }
    },
  };
};

plugin.postcss = true;
export default plugin;
