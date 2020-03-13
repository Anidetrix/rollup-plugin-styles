import path from "path";
import fs from "fs-extra";
import { ExistingRawSourceMap } from "rollup";
import { relativePath, isAbsolutePath, normalizePath, isRelativePath } from "./path-utils";
import composeRegExp from "./compose-regexp";

export const dataURIRe = /data:[^\n\r;]+?(?:;charset=[^\n\r;]+?)?;base64,([\d+/A-Za-z]+={0,2})/;
export const mapBlockRe = /\/\*[#*@]+?\s*?sourceMappingURL\s*?=\s*?(\S+)\s*?\*+?\//;
export const mapInlineRe = /\/\/[#@]+?\s*?sourceMappingURL\s*?=\s*?(\S+)\s*?(?:$|\n|\r\n)/;
export const mapRe = composeRegExp(mapBlockRe, mapInlineRe);

/**
 * Get the map from inlined data
 *
 * @param {string} code CSS string
 * @returns {string|undefined} stringified sourcemap object extracted from `code`
 */
export function getInlineMap(code: string): string | undefined {
  if (!mapRe.test(code)) return;
  const matches = dataURIRe.exec(code);
  if (!matches || (matches && matches.length < 2)) return;
  return Buffer.from(matches[1], "base64").toString();
}

/**
 * Get the map from file
 *
 * @param {string} code CSS string
 * @param {string} id path to the original CSS file
 * @returns {Promise<string|undefined>} stringified sourcemap object extracted from `code`
 */
export async function getExtractedMap(code: string, id: string): Promise<string | undefined> {
  if (dataURIRe.test(code)) return;
  const matches = mapBlockRe.exec(code) || mapInlineRe.exec(code);
  if (!matches || (matches && matches.length < 2)) return;
  const mapFileName = path.resolve(path.dirname(id), matches[1]);
  try {
    return await fs.readFile(mapFileName, "utf8");
  } catch (error) {
    return;
  }
}

/**
 * Get the map from either file or inlined data
 *
 * @param {string} code CSS string
 * @param {string} id path to the original CSS file
 * @returns {Promise<string|undefined>} stringified sourcemap object extracted from `code`
 */
export async function getMap(code: string, id: string): Promise<string | undefined> {
  let map = getInlineMap(code);
  if (!map) map = await getExtractedMap(code, id);
  return map;
}

/**
 * Strip sourceMappingURL comment from CSS string
 *
 * @param {string} code CSS string
 * @returns {string} `code` with stripped sourceMappingURL comment
 */
export function stripMap(code: string): string {
  if (!mapRe.test(code)) return code;
  return code.replace(mapRe, "").replace(/\s+$/, "");
}

/**
 * Modify map using the provided function
 *
 * @param {object|string} map sourcemap
 * @param {Function} f function used to modify the sourcemap
 * @returns {Promise<object>} sourcemap
 */
export async function modifyMap(
  map: ExistingRawSourceMap | string,
  f: (m: ExistingRawSourceMap) => void | Promise<void>,
): Promise<ExistingRawSourceMap> {
  const objmap: ExistingRawSourceMap = typeof map === "string" && map ? JSON.parse(map) : map;
  await f(objmap);
  return objmap;
}

/**
 * Resolve map sources to absolute path
 *
 * @param {object|string} map sourcemap
 * @param {string} dir path which is joined with sourcemap sources
 * @returns {Promise<object>} sourcemap
 */
export function resolveMap(
  map: ExistingRawSourceMap | string,
  dir: string,
): Promise<ExistingRawSourceMap> {
  return modifyMap(map, objmap => {
    if (objmap.sources)
      objmap.sources = objmap.sources.map(source =>
        normalizePath(path.resolve(path.join(dir, source))),
      );
  });
}

/**
 * Resolve map sources relative to the provided directory path
 *
 * @param {object|string} map sourcemap
 * @param {string} [dir=process.cwd()] path to resolve sourcemap sources relative to
 * @returns {Promise<object>} sourcemap
 */
export function relativeMap(
  map: ExistingRawSourceMap | string,
  dir: string = process.cwd(),
): Promise<ExistingRawSourceMap> {
  return modifyMap(map, objmap => {
    if (objmap.sources)
      objmap.sources = objmap.sources.map(source => {
        if (isAbsolutePath(source)) {
          return relativePath(dir, source);
        } else if (isRelativePath(source)) {
          return relativePath(path.dirname(path.join(dir, source)), source);
        } else {
          return normalizePath(source);
        }
      });
  });
}

/**
 * Make sourceMappingURL comment with inlined sourcemap
 *
 * @param {string} map stringified sourcemap object
 * @returns {string} sourceMappingURL block comment with inlined sourcemap
 */
export function makeMapDataComment(map: string): string {
  const sourceMapData = Buffer.from(map, "utf8").toString("base64");
  return `\n/*# sourceMappingURL=data:application/json;base64,${sourceMapData} */`;
}

/**
 * Make sourceMappingURL comment with with path to sourcemap file
 *
 * @param {string} file path to sourcemap file
 * @returns {string} sourceMappingURL block comment with path to sourcemap file
 */
export function makeMapFileComment(file: string): string {
  const fileName = path.basename(file);
  return `\n/*# sourceMappingURL=${fileName}.map */`;
}
