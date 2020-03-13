import path from "path";
import fs from "fs-extra";
import { AsyncOpts } from "resolve";
import postcss from "postcss";
import { extractICSS, replaceSymbols, replaceValueSymbols, CSSImports } from "icss-utils";

import resolveAsync from "../../utils/resolve-async";
import { normalizePath } from "../../utils/path-utils";
import { mapValueAsync } from "../../utils/object-utils";

const name = "postcss-import-export-plugin";

/**
 * Function for loading ICSS from composed files
 */
export type Load = (
  url: string,
  file: string,
  extensions: string[],
  processor: postcss.Processor,
) => Promise<{ [k: string]: string }>;

export interface ImportExportOptions {
  load?: Load;
  getJSON?: (file: string, json: { [k: string]: string }, out?: string) => void;
  extensions?: string[];
}

const defaultLoad: Load = async (url, file, extensions, processor) => {
  let from: string;
  const properUrl = normalizePath(url);
  const asyncOpts: AsyncOpts = { basedir: path.dirname(file), extensions };
  try {
    from = await resolveAsync(properUrl, asyncOpts);
  } catch (error) {
    from = await resolveAsync(`./${properUrl}`, asyncOpts);
  }
  const source = await fs.readFile(from, "utf8");
  const { messages } = await processor.process(source, { from });
  return messages
    .filter(msg => msg.plugin === name && msg.type === "export")
    .map(msg => msg.json as { [k: string]: string })
    .reduce((prev, current) => ({ ...prev, ...current }));
};

/**
 * @param {object} icssImports ICSS Imports
 * @param {Function} load Dependency loader
 * @param {string} file Input file
 * @param {string[]} extensions File extensions
 * @param {object} processor PostCSS Processor
 * @returns {Promise<object>} Resolved imported values
 */
function resolveImportedValues(
  icssImports: CSSImports,
  load: Load,
  file: string,
  extensions: string[],
  processor: postcss.Processor,
): Promise<{ [k: string]: string }> {
  return Object.entries(icssImports).reduce(async (result, [url, values]) => {
    const exports = await load(url, file, extensions, processor);
    return {
      ...(await result),
      ...(await mapValueAsync(values, x => exports[x])),
    };
  }, Promise.resolve({}));
}

const plugin: postcss.Plugin<ImportExportOptions> = postcss.plugin(
  name,
  options => async (css, res): Promise<void> => {
    if (!css.source) throw new Error("No source detected!");
    if (!css.source.input.file) throw new Error("`from` field required!");
    if (!res.processor) throw new Error("No processor detected!");

    const load = (options && options.load) || defaultLoad;
    const extensions = (options && options.extensions) || [".css"];

    const { icssExports, icssImports } = extractICSS(css);

    const importedValues = await resolveImportedValues(
      icssImports,
      load,
      css.source.input.file,
      extensions,
      res.processor,
    );

    replaceSymbols(css, importedValues);

    const json: { [k: string]: string } = {};
    Object.entries(icssExports).forEach(([k, v]) => {
      json[k] = replaceValueSymbols(v, importedValues);
    });

    // Needed mainly for the plugin itself, for recursion
    res.messages.push({ plugin: name, type: "export", json });

    if (options && typeof options.getJSON === "function")
      options.getJSON(css.source.input.file, json, res.opts && res.opts.to);
  },
);

export default plugin;
