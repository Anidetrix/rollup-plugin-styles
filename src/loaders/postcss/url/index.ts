import path from "path";
import postcss from "postcss";
import valueParser, { Node, ParsedValue } from "postcss-value-parser";

import { mm } from "../../../utils/sourcemap";
import { normalizePath, isAbsolutePath } from "../../../utils/path";

import { firstExtRe, dataURIRe } from "../common";

import resolveDefault, { UrlResolve } from "./resolve";
import generateName from "./generate";
import { walkUrls, isDeclWithUrl } from "./utils";
import inlineFile from "./inline";

const name = "styles-url";

/** URL handler options */
export interface UrlOptions {
  /**
   * Inline files instead of copying
   * @default true for `inject` mode, otherwise false
   */
  inline?: boolean;
  /**
   * Public Path for URLs in CSS files
   * @default "./"
   */
  publicPath?: string;
  /**
   * Directory path for outputted CSS assets,
   * which is not included into resulting URL
   * @default "."
   */
  assetDir?: string;
  /**
   * Enable/disable name generation with hash for outputted CSS assets
   * or provide your own placeholder with the following blocks:
   * - `[extname]`: The file extension of the asset including a leading dot, e.g. `.png`.
   * - `[ext]`: The file extension without a leading dot, e.g. `png`.
   * - `[hash(:<num>)]`: A hash based on the name and content of the asset (with optional length).
   * - `[name]`: The file name of the asset excluding any extension.
   *
   * Forward slashes / can be used to place files in sub-directories.
   * @default "assets/[name]-[hash][extname]" ("assets/[name][extname]" if false)
   */
  hash?: boolean | string;
  /**
   * Provide custom resolver for URLs
   * in place of the default one
   */
  resolve?: UrlResolve;
  /**
   * Aliases for URL paths.
   * Overrides the global `alias` option.
   * - ex.: `{"foo":"bar"}`
   */
  alias?: { [from: string]: string };
}

const plugin: postcss.Plugin<UrlOptions> = postcss.plugin(
  name,
  (options = {}) => async (css, res): Promise<void> => {
    if (!css.source?.input.file) return;

    const inline = options.inline ?? false;
    const publicPath = options.publicPath ?? "./";
    const assetDir = options.assetDir ?? ".";
    const resolve = options.resolve ?? resolveDefault;
    const alias = options.alias ?? {};
    const placeholder =
      options.hash ?? true
        ? typeof options.hash === "string"
          ? options.hash
          : "assets/[name]-[hash][extname]"
        : "assets/[name][extname]";

    const { file } = css.source.input;
    const map = await mm(css.source.input.map?.text).resolve(path.dirname(file)).toConsumer();

    const nodeSet = new Set<{
      node: Node;
      url: string;
      decl: postcss.Declaration;
      parsed: ParsedValue;
      basedir: string;
    }>();

    const imported = res.messages
      .filter(msg => msg.type === "dependency")
      .map<string>(msg => msg.file);

    css.walkDecls(decl => {
      if (!isDeclWithUrl(decl)) return;
      const parsed = valueParser(decl.value);
      walkUrls(parsed, (url, node) => {
        // Resolve aliases
        for (const [from, to] of Object.entries(alias)) {
          if (!url.startsWith(from)) continue;
          url = normalizePath(to) + url.slice(from.length);
        }

        // Empty URL
        if (!node || url.length === 0) {
          decl.warn(res, `Empty URL in \`${decl.toString()}\``);
          return;
        }

        // Skip Data URI
        if (dataURIRe.test(url)) return;

        // Skip Web URLs
        if (!isAbsolutePath(url)) {
          try {
            new URL(url);
            return;
          } catch {
            // Is not a Web URL, continuing
          }
        }

        // Use PostCSS imports
        if (decl.source?.input.file && imported.includes(decl.source.input.file)) {
          const basedir = path.dirname(decl.source.input.file);
          nodeSet.add({ node, url, decl, parsed, basedir });
          return;
        }

        // Use SourceMap
        if (decl.source?.start) {
          const pos = decl.source.start;
          const realPos = map?.originalPositionFor(pos);
          const basedir = realPos?.source && path.dirname(realPos.source);
          if (basedir) {
            nodeSet.add({ node, url, decl, parsed, basedir });
            return;
          }
        }

        // Use current file
        const basedir = path.dirname(file);
        nodeSet.add({ node, url, decl, parsed, basedir });
      });
    });

    map?.destroy();
    const usedNames = new Map<string, string>();

    for await (const { node, url, decl, parsed, basedir } of nodeSet) {
      try {
        const { source, from } = await resolve(url, basedir);

        if (!(source instanceof Uint8Array) || typeof from !== "string") {
          decl.warn(res, `Incorrectly resolved URL \`${url}\` in \`${decl.toString()}\``);
          continue;
        }

        res.messages.push({ plugin: name, type: "dependency", file: from });

        if (inline) {
          node.type = "string";
          node.value = inlineFile(from, source);
        } else {
          let safeTo, to;
          to = safeTo = normalizePath(generateName(placeholder, from, source));

          // Avoid file overrides
          for (let i = 1; usedNames.has(safeTo) && usedNames.get(safeTo) !== from; i++)
            safeTo = firstExtRe.test(to) ? to.replace(firstExtRe, `${i}$1`) : `${to}${i}`;

          to = safeTo;
          usedNames.set(to, from);

          node.type = "string";
          node.value = publicPath + (/[/\\]$/.test(publicPath) ? "" : "/") + path.basename(to);

          to = normalizePath(assetDir, safeTo);
          res.messages.push({ plugin: name, type: "asset", to, source });
        }

        decl.value = parsed.toString();
      } catch {
        decl.warn(res, `Unresolved URL \`${url}\` in \`${decl.toString()}\``);
      }
    }
  },
);

export default plugin;
