/// <reference types="./typings/fibers" />
/// <reference types="./typings/less" />
/// <reference types="./typings/postcss-modules" />
/// <reference types="./typings/sass" />
/// <reference types="./typings/stylus" />

import { createFilter } from "@rollup/pluginutils";

import path from "path";
import Concat from "concat-with-sourcemaps";
import { Plugin } from "rollup";
import postcss from "postcss";
import cssnano from "cssnano";

import { Options, PostCSSLoaderOptions, LoaderContext, Payload, ExtractedData } from "./types";
import Loaders from "./loaders";
import { relativePath } from "./utils/path-utils";
import { MapModifier } from "./utils/sourcemap-utils";
import {
  inferOption,
  ensureOption,
  ensureUseOption,
  ensurePCSSOption,
  ensurePCSSPlugins,
} from "./utils/options-utils";

export default (options: Options = {}): Plugin => {
  const filter = createFilter(options.include, options.exclude);

  const postcssLoaderOptions: PostCSSLoaderOptions = {
    minimize: inferOption(options.minimize, false),
    config: inferOption(options.config, {}),
    modules: inferOption(options.modules, false),

    inject: ensureOption(options.inject, true),
    extract: ensureOption(options.extract, false),
    namedExports: ensureOption(options.namedExports, false),
    autoModules: ensureOption(options.autoModules, false),
    extensions: ensureOption(options.extensions, [".css", ".sss", ".pcss"]),

    postcss: {
      parser: ensurePCSSOption(options.parser),
      syntax: ensurePCSSOption(options.syntax),
      stringifier: ensurePCSSOption(options.stringifier),
      plugins: ensurePCSSPlugins(options.plugins),
    },
  };

  const loaders = new Loaders({
    use: [["postcss", postcssLoaderOptions], "sourcemap", ...ensureUseOption(options.use)],
    loaders: ensureOption(options.loaders, []),
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
        { code, map: options.sourceMap ? this.getCombinedSourcemap().toString() : undefined },
        loaderContext,
      );

      for (const dep of loaderContext.dependencies) this.addWatchFile(dep);

      if (postcssLoaderOptions.extract) {
        res.extracted && extracted.set(id, res.extracted);
        return {
          code: res.code,
          map: { mappings: "" as const },
        };
      }

      return {
        code: res.code,
        map: res.map || { mappings: "" as const },
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
        const fileDir = path.dirname(path.resolve(dir, fileName));

        const modules = [...this.moduleIds];
        const entries = [...extracted.values()].sort(
          (a, b) => modules.indexOf(a.id) - modules.indexOf(b.id),
        );

        const concat = new Concat(true, path.basename(fileName), "\n");
        for (const res of entries) {
          const relative = relativePath(dir, res.id);
          const map = res.map && new MapModifier(res.map).relative(fileDir).toObject();
          type ConcatSourceMap = Exclude<Parameters<typeof concat.add>[2], string | undefined>;
          concat.add(relative, res.code, (map as unknown) as ConcatSourceMap);
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
        const cssOpts: cssnano.CssNanoOptions & postcss.ProcessOptions =
          typeof postcssLoaderOptions.minimize === "object" ? postcssLoaderOptions.minimize : {};

        cssOpts.from = res.codeFileName;
        if (options.sourceMap === "inline") {
          cssOpts.map = { inline: true };
        } else if (options.sourceMap === true) {
          cssOpts.map = { prev: res.map };
          cssOpts.to = res.codeFileName;
        }

        const resMin = await cssnano.process(res.code, cssOpts);
        res.code = resMin.css;
        if (options.sourceMap === true) res.map = resMin.map && resMin.map.toString();
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
