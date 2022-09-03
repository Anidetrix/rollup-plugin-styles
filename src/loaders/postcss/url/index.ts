import path from "path";
import { Declaration, PluginCreator } from "postcss";
import valueParser, { Node, ParsedValue } from "postcss-value-parser";
import { mm } from "../../../utils/sourcemap";
import { normalizePath, isAbsolutePath } from "../../../utils/path";
import { firstExtRe, dataURIRe } from "../common";
import resolveDefault, { UrlResolve, UrlFile } from "./resolve";
import generateName from "./generate";
import { walkUrls, isDeclWithUrl } from "./utils";
import inlineFile from "./inline";

const name = "styles-url";
const placeholderHashDefault = "assets/[name]-[hash][extname]";
const placeholderNoHashDefault = "assets/[name][extname]";

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
  publicPath?: string | ((original: string, resolved: string) => string);
  /**
   * Directory path for outputted CSS assets,
   * which is not included into resulting URL
   * @default "."
   */
  assetDir?: string | ((original: string, resolved: string) => string);
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
  alias?: Record<string, string>;
}

const plugin: PluginCreator<UrlOptions> = (options = {}) => {
  const defaultpublicPath = "./";
  const defaultAssetDir = ".";
  const inline = options.inline ?? false;
  const publicPath = options.publicPath ?? defaultpublicPath;
  const assetDir = options.assetDir ?? defaultAssetDir;
  const resolve = options.resolve ?? resolveDefault;
  const alias = options.alias ?? {};
  const placeholder =
    options.hash ?? true
      ? typeof options.hash === "string"
        ? options.hash
        : placeholderHashDefault
      : placeholderNoHashDefault;

  return {
    postcssPlugin: name,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async Once(css, { result: res }) {
      if (!css.source?.input.file) return;

      const { file } = css.source.input;
      const map = mm(css.source.input.map?.text).resolve(path.dirname(file)).toConsumer();

      const urlList: {
        node: Node;
        url: string;
        decl: Declaration;
        parsed: ParsedValue;
        basedirs: Set<string>;
      }[] = [];

      const imported = res.messages
        .filter(msg => msg.type === "dependency")
        .map(msg => msg.file as string);

      css.walkDecls(decl => {
        if (!isDeclWithUrl(decl)) return;
        const parsed = valueParser(decl.value);
        walkUrls(parsed, (url, node) => {
          // Resolve aliases
          for (const [from, to] of Object.entries(alias)) {
            if (url !== from && !url.startsWith(`${from}/`)) continue;
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

          const basedirs = new Set<string>();

          // Use PostCSS imports
          if (decl.source?.input.file && imported.includes(decl.source.input.file))
            basedirs.add(path.dirname(decl.source.input.file));

          // Use SourceMap
          if (decl.source?.start) {
            const pos = decl.source.start;
            const realPos = map?.originalPositionFor(pos);
            const basedir = realPos?.source && path.dirname(realPos.source);
            if (basedir) basedirs.add(path.normalize(basedir));
          }

          // Use current file
          basedirs.add(path.dirname(file));

          urlList.push({ node, url, decl, parsed, basedirs });
        });
      });

      const usedNames = new Map<string, string>();

      for await (const { node, url, decl, parsed, basedirs } of urlList) {
        let resolved: UrlFile | undefined;
        for await (const basedir of basedirs) {
          try {
            if (!resolved) resolved = await resolve(url, basedir);
          } catch {
            /* noop */
          }
        }

        if (!resolved) {
          decl.warn(res, `Unresolved URL \`${url}\` in \`${decl.toString()}\``);
          continue;
        }

        const { source, from, urlQuery } = resolved;
        if (!(source instanceof Uint8Array) || typeof from !== "string") {
          decl.warn(res, `Incorrectly resolved URL \`${url}\` in \`${decl.toString()}\``);
          continue;
        }

        res.messages.push({ plugin: name, type: "dependency", file: from });

        if (inline) {
          node.type = "string";
          node.value = inlineFile(from, source);
        } else {
          const unsafeTo = normalizePath(generateName(placeholder, from, source));
          let to = unsafeTo;

          // Avoid file overrides
          const hasExt = firstExtRe.test(unsafeTo);
          for (let i = 1; usedNames.has(to) && usedNames.get(to) !== from; i++) {
            to = hasExt ? unsafeTo.replace(firstExtRe, `${i}$1`) : `${unsafeTo}${i}`;
          }

          usedNames.set(to, from);

          const resolvedPublicPath =
            typeof publicPath === "string"
              ? publicPath + (/[/\\]$/.test(publicPath) ? "" : "/") + path.basename(to)
              : `${defaultpublicPath}${path.basename(to)}`;

          node.type = "string";
          node.value =
            typeof publicPath === "function"
              ? publicPath(node.value, resolvedPublicPath)
              : resolvedPublicPath;

          if (urlQuery) node.value += urlQuery;
          to = normalizePath(typeof assetDir === "string" ? assetDir : defaultAssetDir, to);
          to = typeof assetDir === "function" ? assetDir(from, to) : to;

          res.messages.push({ plugin: name, type: "asset", to, source });
        }

        decl.value = parsed.toString();
      }
    },
  };
};

plugin.postcss = true;
export default plugin;
