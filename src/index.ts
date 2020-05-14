/// <reference types="./typings/fibers" />
/// <reference types="./typings/less" />
/// <reference types="./typings/postcss-modules" />
/// <reference types="./typings/sass" />
/// <reference types="./typings/stylus" />

import { createFilter } from "@rollup/pluginutils";

import path from "path";
import Concat from "concat-with-sourcemaps";
import { Plugin, OutputChunk, OutputAsset } from "rollup";
import postcss from "postcss";
import cssnano from "cssnano";

import { ExtractedData, LoaderContext, Options, Payload, PostCSSLoaderOptions } from "./types";
import Loaders from "./loaders";
import {
  humanlizePath,
  normalizePath,
  relativePath,
  isAbsolutePath,
  isRelativePath,
} from "./utils/path";
import { mm } from "./utils/sourcemap";
import {
  inferOption,
  inferResolverOption,
  ensurePCSSOption,
  ensurePCSSPlugins,
  ensureUseOption,
  inferModeOption,
} from "./utils/options";
import { getIds } from "./utils/chunk";

export default (options: Options = {}): Plugin => {
  const filter = createFilter(options.include, options.exclude);

  const postcssLoaderOpts: PostCSSLoaderOptions = {
    ...inferModeOption(options.mode),

    minimize: inferOption(options.minimize, false),
    config: inferOption(options.config, {}),
    import: inferResolverOption(options.import, options.alias),
    url: inferResolverOption(options.url, options.alias),
    modules: inferOption(options.modules, false),

    to: options.to,
    namedExports: options.namedExports ?? false,
    autoModules: options.autoModules ?? false,
    extensions: options.extensions ?? [".css", ".pcss", ".postcss", ".sss"],

    postcss: {
      parser: ensurePCSSOption(options.parser, "parser"),
      syntax: ensurePCSSOption(options.syntax, "syntax"),
      stringifier: ensurePCSSOption(options.stringifier, "stringifier"),
      plugins: ensurePCSSPlugins(options.plugins),
    },
  };

  const loaders = new Loaders({
    use: [["postcss", postcssLoaderOpts], ...ensureUseOption(options.use, options), "sourcemap"],
    loaders: options.loaders ?? [],
    extensions: postcssLoaderOpts.extensions,
  });

  const isSupported = (id: string): boolean => filter(id) && loaders.isSupported.call(loaders, id);

  const extracted = new Map<string, NonNullable<Payload["extracted"]>>();

  const plugin: Plugin = {
    name: "styles",

    async transform(code, id) {
      if (!isSupported(id)) return;

      // Check if file was already processed into JS
      // by other instance(s) of this or other plugin(s)
      try {
        this.parse(code, {}); // If it doesn't throw...
        this.warn(`Skipping processed file ${humanlizePath(id)}`);
        return;
      } catch {
        // Was not already processed, continuing
      }

      if (typeof options.onImport === "function") options.onImport(code, id);

      const ctx: LoaderContext = {
        id,
        sourceMap: options.sourceMap,
        deps: new Set(),
        assets: new Map<string, Uint8Array>(),
        warn: this.warn.bind(this),
        plugin: this,
        options: {},
      };

      const res = await loaders.process({ code }, ctx);

      for (const dep of ctx.deps) this.addWatchFile(dep);

      for (const [fileName, source] of ctx.assets)
        this.emitFile({ type: "asset", fileName, source });

      if (postcssLoaderOpts.extract) {
        res.extracted && extracted.set(id, res.extracted);
        return {
          code: res.code,
          map: { mappings: "" as const },
        };
      }

      return {
        code: res.code,
        map: (options.sourceMap ? res.map : undefined) ?? { mappings: "" as const },
      };
    },

    augmentChunkHash(chunk) {
      if (extracted.size === 0) return;

      const infoFn = this.getModuleInfo.bind(this);
      const chunkIds = getIds(chunk, infoFn).filter(isSupported);

      if (chunkIds.length === 0) return;

      const moduleIds = [...this.moduleIds];

      const hashable = [...extracted.values()]
        .filter(e => chunkIds.includes(e.id))
        .sort((a, b) => moduleIds.indexOf(a.id) - moduleIds.indexOf(b.id))
        .map(e => ({
          name: chunk.name,
          ...e,
          id: path.basename(e.id),
          map: mm(e.map).relative(path.dirname(e.id)).toString(),
        }));

      if (hashable.length === 0) return;

      return JSON.stringify(hashable);
    },

    async generateBundle(opts, bundle) {
      if (extracted.size === 0 || !(opts.dir || opts.file)) return;

      const infoFn = this.getModuleInfo.bind(this);

      const dir = opts.dir ?? path.dirname(opts.file ?? "");

      const getExtractedData = (name: string, ids: string[]): ExtractedData => {
        const fileName =
          typeof postcssLoaderOpts.extract === "string"
            ? normalizePath(postcssLoaderOpts.extract).replace(/^\.[/\\]/, "")
            : normalizePath(`${name}.css`);

        if (isAbsolutePath(fileName))
          this.error(
            [
              "Extraction path must be relative to the output directory,",
              `which is ${humanlizePath(dir)}`,
            ].join("\n"),
          );

        if (isRelativePath(fileName))
          this.error(
            [
              "Extraction path must be nested inside output directory,",
              `which is ${humanlizePath(dir)}`,
            ].join("\n"),
          );

        const fileDir = path.dirname(path.resolve(dir, fileName));

        const entries = [...extracted.values()]
          .filter(e => ids.includes(e.id))
          .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

        const concat = new Concat(true, path.basename(fileName), "\n");
        for (const res of entries) {
          const relative = relativePath(dir, res.id);
          const map = mm(res.map).relative(fileDir).toObject();
          type ConcatSourceMap = Exclude<Parameters<typeof concat.add>[2], string | undefined>;
          concat.add(relative, res.css, (map as unknown) as ConcatSourceMap);
        }

        return {
          css: concat.content.toString(),
          map: options.sourceMap ? concat.sourceMap : undefined,
          name: fileName,
        };
      };

      const getEmitted = (): Map<string, string[]> => {
        const moduleIds = [...this.moduleIds];
        const chunks: OutputChunk[] = [];
        const [index, ...entries] = Object.values(bundle).filter((c): c is OutputChunk => {
          if (c.type !== "chunk") return false;
          if (c.isEntry) return true;
          chunks.push(c);
          return false;
        });

        const idsMap = new Map<string, string[]>();

        const chunkIds: string[] = [];
        for (const chunk of chunks) {
          const ids = getIds(chunk, infoFn)
            .filter(isSupported)
            .sort((a, b) => moduleIds.indexOf(a) - moduleIds.indexOf(b));

          if (ids.length === 0) continue;
          chunkIds.push(...ids);

          if (typeof postcssLoaderOpts.extract === "string") continue;
          idsMap.set(chunk.name, ids);
        }

        const entryIds: string[] = [];
        for (const entry of entries) {
          const ids = getIds(entry, infoFn)
            .filter(id => !chunkIds.includes(id) && isSupported(id))
            .sort((a, b) => moduleIds.indexOf(a) - moduleIds.indexOf(b));

          if (ids.length === 0) continue;
          entryIds.push(...ids);

          if (typeof postcssLoaderOpts.extract === "string") continue;
          idsMap.set(entry.name, ids);
        }

        const orderedIds = [
          ...moduleIds.filter(id => !entryIds.includes(id) && !chunkIds.includes(id)),
          ...entryIds,
          ...chunkIds,
        ];

        const indexIds = moduleIds
          .filter(id => {
            if (typeof postcssLoaderOpts.extract === "string") return isSupported(id);
            return !entryIds.includes(id) && !chunkIds.includes(id) && isSupported(id);
          })
          .sort((a, b) => orderedIds.lastIndexOf(a) - orderedIds.lastIndexOf(b));

        if (indexIds.length > 0) {
          idsMap.set(
            opts.file ? path.basename(opts.file, path.extname(opts.file)) : index.name,
            indexIds,
          );
        }

        return idsMap;
      };

      for await (const [name, ids] of getEmitted()) {
        const res = getExtractedData(name, ids);

        if (typeof options.onExtract === "function") {
          const shouldExtract = options.onExtract(res);
          if (!shouldExtract) continue;
        }

        // Perform minimization on the extracted file
        if (postcssLoaderOpts.minimize) {
          const cssNanoOpts: cssnano.CssNanoOptions & postcss.ProcessOptions =
            typeof postcssLoaderOpts.minimize === "object" ? postcssLoaderOpts.minimize : {};

          cssNanoOpts.from = res.name;
          cssNanoOpts.to = res.name;
          cssNanoOpts.map = {
            inline: false,
            annotation: false,
            sourcesContent: true,
            prev: res.map,
          };

          const resMin = await cssnano.process(res.css, cssNanoOpts);
          res.css = resMin.css;
          if (options.sourceMap) res.map = resMin.map?.toString();
        }

        const cssFileId = this.emitFile({
          type: "asset",
          name: res.name,
          source: res.css,
        });

        if (res.map) {
          const fileName = this.getFileName(cssFileId);

          const assetDir = opts.assetFileNames
            ? normalizePath(path.dirname(opts.assetFileNames))
            : "assets"; // Default for Rollup v2

          const map = mm(res.map)
            .modify(m => {
              m.file = path.basename(fileName);
            })
            .modifySources(s => {
              // Compensate for possible nesting depending on `assetFileNames` value
              if (s === "<no source>") return s;
              if (assetDir.length <= 1) return s;
              s = `../${s}`; // If it didnt return then there's definitely at least 1 level offset
              for (const c of assetDir) if (c === "/") s = `../${s}`;
              return s;
            });

          if (options.sourceMap === "inline") {
            (bundle[fileName] as OutputAsset).source += map.toCommentData();
          } else if (options.sourceMap === true) {
            const mapFileId = this.emitFile({
              type: "asset",
              fileName: `${fileName}.map`,
              source: map.toString(),
            });
            const mapFileName = path.basename(this.getFileName(mapFileId));
            (bundle[fileName] as OutputAsset).source += map.toCommentFile(mapFileName);
          }
        }
      }
    },
  };

  return plugin;
};
