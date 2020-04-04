import path from "path";
import fs from "fs-extra";
import { ExistingRawSourceMap } from "rollup";
import { relativePath, isAbsolutePath, resolvePath } from "./path-utils";

const dataURIRe = /data:[^\n\r;]+?(?:;charset=[^\n\r;]+?)?;base64,([\d+/A-Za-z]+={0,2})/;
const mapBlockRe = /\/\*[#*@]+?\s*?sourceMappingURL\s*?=\s*?(\S+)\s*?\*+?\//;
const mapInlineRe = /\/\/[#@]+?\s*?sourceMappingURL\s*?=\s*?(\S+)\s*?(?:$|\n|\r\n)/;
const mapRe = new RegExp([mapBlockRe, mapInlineRe].map(re => re.source).join("|"));

/**
 * Get the map from inlined data
 * @param code CSS string
 * @returns stringified sourcemap object extracted from `code`
 */
export function getInlineMap(code: string): string | undefined {
  if (!mapRe.test(code)) return;
  const matches = dataURIRe.exec(code);
  if (!matches || (matches && matches.length < 2)) return;
  return Buffer.from(matches[1], "base64").toString();
}

/**
 * Get the map from file
 * @param code CSS string
 * @param id path to the original CSS file
 * @returns stringified sourcemap object extracted from `code`
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
 * @param code CSS string
 * @param id path to the original CSS file
 * @returns stringified sourcemap object extracted from `code`
 */
export async function getMap(code: string, id: string): Promise<string | undefined> {
  let map = getInlineMap(code);
  if (!map) map = await getExtractedMap(code, id);
  return map;
}

/**
 * Strip sourceMappingURL comment from CSS string
 * @param code CSS string
 * @returns `code` with stripped sourceMappingURL comment
 */
export function stripMap(code: string): string {
  if (!mapRe.test(code)) return code;
  return code.replace(mapRe, "").replace(/\s+$/, "");
}

/**
 * Class for working with sourcemaps, supports chaining
 */
export class MapModifier {
  private map: ExistingRawSourceMap;

  /** @param map sourcemap */
  constructor(map: string | ExistingRawSourceMap) {
    if (!map) throw new TypeError("`map` must be an object or a string");
    this.map = typeof map === "string" ? JSON.parse(map) : map;
  }

  /**
   * Modify map using the provided function
   * @param f function used to modify the sourcemap
   * @returns itself for chaining
   */
  modify(f: (m: ExistingRawSourceMap) => void): this {
    f(this.map);
    return this;
  }

  /**
   * Resolve map sources to absolute path
   * @param dir path which is joined with sourcemap sources
   * @returns itself for chaining
   */
  resolve(dir: string): this {
    if (this.map.sources) {
      this.map.sources = this.map.sources.map(source => resolvePath(dir, source));
    }
    return this;
  }

  /**
   * Resolve map sources relative to the provided directory path
   * or to current working directory
   * @param dir path to resolve sourcemap sources relative to
   * @returns itself for chaining
   */
  relative(dir = process.cwd()): this {
    if (this.map.sources) {
      this.map.sources = this.map.sources.map(source => {
        if (isAbsolutePath(source)) return relativePath(dir, source);
        else return relativePath(dir, path.join(dir, source));
      });
    }
    return this;
  }

  /**
   * Returns sourcemap
   * @returns sourcemap object
   */
  toObject(): ExistingRawSourceMap {
    return this.map;
  }

  /**
   * Converts sourcemap to string
   * @returns stringified sourcemap
   */
  toString(): string {
    return JSON.stringify(this.map);
  }

  /**
   * Make sourceMappingURL comment with inlined sourcemap
   * @returns sourceMappingURL block comment with inlined sourcemap
   */
  toCommentData(): string {
    const sourceMapData = Buffer.from(this.toString(), "utf8").toString("base64");
    return `\n/*# sourceMappingURL=data:application/json;base64,${sourceMapData} */`;
  }

  /**
   * Make sourceMappingURL comment with with path to sourcemap file
   * @param file file for comment generation
   * @returns sourceMappingURL block comment with path to sourcemap file
   */
  toCommentFile(file: string): string {
    const fileName = path.basename(file);
    return `\n/*# sourceMappingURL=${fileName}.map */`;
  }
}
