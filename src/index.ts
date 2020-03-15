import { createFilter } from "@rollup/pluginutils";

import path from "path";
import Concat from "concat-with-sourcemaps";
import { Plugin } from "rollup";
import cssnano, { CssNanoOptions } from "cssnano";
import postcss from "postcss";

import {
  Options,
  PostCSSLoaderOptions,
  LoaderContext,
  Payload,
  ExtractedData,
  ObjectWithUnknownProps,
} from "./types";
import ensurePostCSSOption from "./utils/ensure-postcss-option";
import Loaders from "./loaders";
import { relativePath, normalizePath } from "./utils/path-utils";
import { MapModifier } from "./utils/sourcemap-utils";

/**
 * Infer options from `boolean` or `object`
 * @param option Option
 * @param defaultValue Default value
 * @returns `object` if `option` is truthy, `false` if `option` is `false`, otherwise `defaultValue`
 */
function inferOption<T extends boolean | object>(option: T | undefined, defaultValue: T): T | {} {
  if (typeof option === "boolean") return option === false ? false : {};
  if (typeof option === "object") return option;
  return defaultValue;
}

/**
 * Make sure option is defined
 * @param option Option
 * @param defaultValue Default value
 * @returns `option` if option is defined, or `defaultValue`
 */
function ensureOption<T>(option: T | undefined, defaultValue: T): T {
  return typeof option !== "undefined" ? option : defaultValue;
}

export default (options: Options = {}): Plugin => {
  const filter = createFilter(options.include, options.exclude);
  const postcssPlugins = Array.isArray(options.plugins)
    ? options.plugins.filter(Boolean)
    : options.plugins;

  const postcssLoaderOptions: PostCSSLoaderOptions = {
    inject:
      typeof options.inject === "function" ? options.inject : inferOption(options.inject, true),
    extract: ensureOption(options.extract, false),
    modules: inferOption(options.modules, false),
    namedExports: ensureOption(options.namedExports, false),
    autoModules: ensureOption(options.autoModules, false),
    minimize: inferOption(options.minimize, false),
    config: inferOption(options.config, {}),
    extensions: ensureOption(options.extensions, [".css", ".sss", ".pcss"]),
    postcss: {
      parser: ensurePostCSSOption(options.parser),
      syntax: ensurePostCSSOption(options.syntax),
      stringifier: ensurePostCSSOption(options.stringifier),
      plugins: postcssPlugins,
    },
  };

  let use: (string | [string, ObjectWithUnknownProps])[] = ["sass", "stylus", "less"];

  if (Array.isArray(options.use)) {
    use = options.use;
  } else if (typeof options.use === "object") {
    use = [
      ["sass", options.use.sass || {}],
      ["stylus", options.use.stylus || {}],
      ["less", options.use.less || {}],
    ];
  }

  use.unshift(["postcss", postcssLoaderOptions], "sourcemap");

  const loaders = new Loaders({
    use,
    loaders: options.loaders,
    extensions: postcssLoaderOptions.extensions,
  });

  const extracted = new Map<string, NonNullable<Payload["extracted"]>>();

  const plugin: Plugin = {
    name: "postcss",

    async transform(code, id) {
      if (!filter(id) || !loaders.isSupported(id)) return null;

      if (typeof options.onImport === "function") options.onImport(code, id);

      const loaderContext: LoaderContext = {
        id,
        sourceMap: options.sourceMap,
        dependencies: new Set<string>(),
        warn: this.warn.bind(this),
        error: this.error.bind(this),
        plugin: this,
        options: {},
      };

      const res = await loaders.process(
        { code, map: this.getCombinedSourcemap().toString() },
        loaderContext,
      );

      for (const dep of loaderContext.dependencies) this.addWatchFile(dep);

      if (postcssLoaderOptions.extract) {
        res.extracted && extracted.set(id, res.extracted);
        return {
          code: res.code,
          map: { mappings: "" as "" },
        };
      }

      return {
        code: res.code,
        map: res.map || { mappings: "" as "" },
      };
    },

    augmentChunkHash() {
      if (extracted.size === 0) return;
      return JSON.stringify([...extracted.values()]);
    },

    async generateBundle(opts, bundle) {
      if (extracted.size === 0 || !(opts.dir || opts.file)) return;

      const dir = opts.dir || path.dirname(opts.file || "");
      const file =
        opts.file ||
        path.join(
          opts.dir || "",
          Object.keys(bundle).find(fileName => {
            const record = bundle[fileName];
            return record.type === "chunk" && record.isEntry;
          }) || "",
        );

      const getExtracted = (): ExtractedData => {
        const fileName =
          typeof postcssLoaderOptions.extract === "string"
            ? relativePath(dir, postcssLoaderOptions.extract)
            : `${path.basename(file, path.extname(file))}.css`;
        const fileDir = normalizePath(path.dirname(path.resolve(dir, fileName)));

        const modules = [...this.moduleIds];
        const entries = [...extracted.values()].sort(
          (a, b) => modules.indexOf(a.id) - modules.indexOf(b.id),
        );

        const concat = new Concat(true, path.basename(fileName), "\n");
        for (const res of entries) {
          const relative = relativePath(dir, res.id);
          const map = res.map && new MapModifier(res.map).relative(fileDir).toObject();
          concat.add(relative, res.code, map);
        }

        let code = concat.content.toString();
        const map = concat.sourceMap && new MapModifier(concat.sourceMap);

        if (map) {
          if (options.sourceMap === "inline") {
            code += map.toCommentData();
          } else if (options.sourceMap === true) {
            code += map.toCommentFile(fileName);
          }
        }

        return {
          code,
          map: options.sourceMap === true && map ? map.toString() : undefined,
          codeFileName: fileName,
          mapFileName: `${fileName}.map`,
        };
      };

      if (options.onExtract) {
        const shouldExtract = options.onExtract(getExtracted);
        if (shouldExtract === false) return;
      }

      const res = getExtracted();

      // Perform cssnano on the extracted file
      if (postcssLoaderOptions.minimize) {
        const cssOpts: CssNanoOptions & postcss.ProcessOptions =
          typeof postcssLoaderOptions.minimize === "object" ? postcssLoaderOptions.minimize : {};

        cssOpts.from = res.codeFileName;
        if (options.sourceMap === "inline") {
          cssOpts.map = { inline: true };
        } else if (options.sourceMap === true) {
          cssOpts.map = { prev: res.map };
          cssOpts.to = res.codeFileName;
        }

        const result = await cssnano.process(res.code, cssOpts);
        res.code = result.css;
        if (options.sourceMap === true) res.map = result.map && result.map.toString();
      }

      this.emitFile({
        type: "asset",
        source: res.code,
        fileName: res.codeFileName,
      });

      if (res.map) {
        this.emitFile({
          type: "asset",
          source: res.map,
          fileName: res.mapFileName,
        });
      }
    },
  };

  return plugin;
};
