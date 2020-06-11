/// <reference types="./shims/postcss-modules" />
/// <reference types="./shims/fibers" />
/// <reference types="./shims/sass" />
/// <reference types="./shims/less" />
/// <reference types="./shims/stylus" />

import path from "path";
import { Plugin, OutputChunk, OutputAsset } from "rollup";
import { createFilter } from "@rollup/pluginutils";
import postcss from "postcss";
import cssnano from "cssnano";
import { LoaderContext, Extracted } from "./loaders/types";
import { ExtractedData, Options, PostCSSLoaderOptions } from "./types";
import Loaders from "./loaders";
import { humanlizePath, normalizePath, isAbsolutePath, isRelativePath } from "./utils/path";
import { mm } from "./utils/sourcemap";
import concat from "./utils/concat";
import {
  inferOption,
  inferModeOption,
  inferSourceMapOption,
  inferHandlerOption,
  ensureUseOption,
  ensurePCSSOption,
  ensurePCSSPlugins,
} from "./utils/options";

export default (options: Options = {}): Plugin => {
  const isIncluded = createFilter(options.include, options.exclude);

  const sourceMap = inferSourceMapOption(options.sourceMap);
  const loaderOpts: PostCSSLoaderOptions = {
    ...inferModeOption(options.mode),

    minimize: inferOption(options.minimize, false),
    config: inferOption(options.config, {}),
    import: inferHandlerOption(options.import, options.alias),
    url: inferHandlerOption(options.url, options.alias),
    modules: inferOption(options.modules, false),

    to: options.to,
    namedExports: options.namedExports ?? false,
    autoModules: options.autoModules ?? false,
    extensions: options.extensions ?? [".css", ".pcss", ".postcss", ".sss"],
    postcss: {},
  };

  if (options.parser) loaderOpts.postcss.parser = ensurePCSSOption(options.parser, "parser");

  if (options.syntax) loaderOpts.postcss.syntax = ensurePCSSOption(options.syntax, "syntax");

  if (options.stringifier)
    loaderOpts.postcss.stringifier = ensurePCSSOption(options.stringifier, "stringifier");

  if (options.plugins) loaderOpts.postcss.plugins = ensurePCSSPlugins(options.plugins);

  const loaders = new Loaders({
    use: [["postcss", loaderOpts], ...ensureUseOption(options), ["sourcemap", {}]],
    loaders: options.loaders,
    extensions: loaderOpts.extensions,
  });

  const extracted: Extracted[] = [];
  let preserveModules: boolean;

  const plugin: Plugin = {
    name: "styles",

    buildStart(opts) {
      preserveModules = Boolean(opts.preserveModules);
    },

    async transform(code, id) {
      if (!isIncluded(id) || !loaders.isSupported(id)) return null;

      // Check if file was already processed into JS
      // by other instance(s) of this or other plugin(s)
      try {
        this.parse(code, {}); // If it doesn't throw...
        this.warn(`Skipping processed file ${humanlizePath(id)}`);
        return null;
      } catch {
        // Was not already processed, continuing
      }

      if (typeof options.onImport === "function") options.onImport(code, id);

      const ctx: LoaderContext = {
        id,
        sourceMap,
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

      if (res.extracted) extracted.push(res.extracted);

      return {
        code: res.code,
        map: (sourceMap ? res.map : undefined) ?? { mappings: "" as const },
        moduleSideEffects: loaderOpts.extract ? true : null,
      };
    },

    augmentChunkHash(chunk) {
      if (extracted.length === 0) return;

      const ids: string[] = [];
      for (const id of Object.keys(chunk.modules)) {
        const i = this.getModuleInfo(id);
        ids.push(i.id, ...i.importedIds);
      }

      const hashable = extracted
        .filter(e => ids.includes(e.id))
        .sort((a, b) => ids.lastIndexOf(a.id) - ids.lastIndexOf(b.id))
        .map(e => ({
          ...e,
          id: path.basename(e.id),
          map: mm(e.map).relative(path.dirname(e.id)).toString(),
        }));

      if (hashable.length === 0) return;

      return JSON.stringify(hashable);
    },

    async generateBundle(opts, bundle) {
      if (extracted.length === 0 || !(opts.dir || opts.file)) return;

      const dir = opts.dir ?? path.dirname(opts.file ?? "");

      const getExtractedData = async (name: string, ids: string[]): Promise<ExtractedData> => {
        const fileName =
          typeof loaderOpts.extract === "string"
            ? normalizePath(loaderOpts.extract).replace(/^\.[/\\]/, "")
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

        const entries = extracted
          .filter(e => ids.includes(e.id))
          .sort((a, b) => ids.lastIndexOf(a.id) - ids.lastIndexOf(b.id));

        const res = await concat(entries);

        return {
          name: fileName,
          css: res.css,
          map: mm(res.map)
            .relative(path.dirname(path.resolve(dir, fileName)))
            .toString(),
        };
      };

      const getName = (chunk: OutputChunk): string => {
        if (opts.file) return path.basename(opts.file, path.extname(opts.file));
        if (preserveModules) {
          const { dir, name } = path.parse(chunk.fileName);
          return dir ? `${dir}/${name}` : name;
        }
        return chunk.name;
      };

      const getImports = (chunk: OutputChunk): string[] => {
        const ordered: string[] = [];
        let ids: string[] = [];

        for (const module of Object.keys(chunk.modules)) {
          const traversed: string[] = [];
          ids.push(module);
          while (ids.length > 0) {
            const imports: string[] = [];
            for (const id of ids) {
              if (traversed.includes(id) || !isIncluded(id)) continue;
              if (loaders.isSupported(id)) ordered.push(id);
              else traversed.push(id);
              imports.push(...this.getModuleInfo(id).importedIds);
            }
            ids = imports;
          }
        }

        return ordered;
      };

      const getEmitted = (): Map<string, string[]> => {
        const emittedMap = new Map<string, string[]>();
        const chunks = Object.values(bundle).filter((c): c is OutputChunk => c.type === "chunk");

        const emitted = preserveModules
          ? chunks
          : chunks.filter(c => c.isEntry || c.isDynamicEntry);

        if (typeof loaderOpts.extract === "string") {
          const name = getName(chunks.find(e => e.isEntry) ?? chunks[0]);
          const ids: string[] = [];
          for (const chunk of emitted) ids.push(...getImports(chunk));
          if (ids.length !== 0) emittedMap.set(name, ids);
          return emittedMap;
        }

        const moved: string[] = [];
        const manual = chunks.filter(c => !c.facadeModuleId);
        for (const chunk of manual) {
          const name = getName(chunk);
          const ids = getImports(chunk);
          if (ids.length !== 0) emittedMap.set(name, ids);
          moved.push(...ids);
        }

        for (const chunk of emitted) {
          const name = getName(chunk);
          const ids = getImports(chunk).filter(id => !moved.includes(id));
          if (ids.length !== 0) emittedMap.set(name, ids);
        }

        return emittedMap;
      };

      for await (const [name, ids] of getEmitted()) {
        const res = await getExtractedData(name, ids);

        if (typeof options.onExtract === "function") {
          const shouldExtract = options.onExtract(res);
          if (!shouldExtract) continue;
        }

        // Perform minimization on the extracted file
        if (loaderOpts.minimize) {
          const cssNanoOpts: cssnano.CssNanoOptions & postcss.ProcessOptions =
            typeof loaderOpts.minimize === "object" ? loaderOpts.minimize : {};

          cssNanoOpts.from = res.name;
          cssNanoOpts.to = res.name;
          cssNanoOpts.map = sourceMap && {
            inline: false,
            annotation: false,
            sourcesContent: sourceMap.content,
            prev: res.map,
          };

          const resMin = await cssnano.process(res.css, cssNanoOpts);
          res.css = resMin.css;
          res.map = resMin.map?.toString();
        }

        const cssFileId = this.emitFile({
          type: "asset",
          name: res.name,
          source: res.css,
        });

        if (res.map && sourceMap) {
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

          if (sourceMap.inline) {
            (bundle[fileName] as OutputAsset).source += map.toCommentData();
          } else {
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
