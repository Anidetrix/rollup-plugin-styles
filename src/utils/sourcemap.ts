import path from "path";
import fs from "fs-extra";
import { RawSourceMap, SourceMapConsumer, BasicSourceMapConsumer } from "source-map";

import { dataURIRe } from "../loaders/postcss/common";

import { isAbsolutePath, relativePath, resolvePath, normalizePath } from "./path";
import { isNullish } from "./filter";

const mapBlockRe = /\/\*[#*@]+?\s*?sourceMappingURL\s*?=\s*?(\S+)\s*?\*+?\//;
const mapInlineRe = /\/\/[#@]+?\s*?sourceMappingURL\s*?=\s*?(\S+)\s*?(?:$|\n|\r\n)/;
const mapRe = new RegExp([mapBlockRe, mapInlineRe].map(re => re.source).join("|"));

export async function getMap(code: string, id?: string): Promise<string | undefined> {
  const [, data] = mapRe.exec(code) ?? [];
  if (!data) return;

  const [, inlineMap] = dataURIRe.exec(data) ?? [];
  if (inlineMap) return Buffer.from(inlineMap, "base64").toString();

  if (!id) return;
  const mapFileName = path.resolve(path.dirname(id), data);
  try {
    return await fs.readFile(mapFileName, "utf8");
  } catch (error) {
    return;
  }
}

export function stripMap(code: string): string {
  return code.replace(mapRe, "");
}

class MapModifier {
  readonly #map?: RawSourceMap;

  constructor(map?: string | RawSourceMap) {
    try {
      this.#map = typeof map === "string" ? (JSON.parse(map) as RawSourceMap) : map;
    } catch (error) {
      this.#map = undefined;
    }
  }

  modify(f: (m: RawSourceMap) => void): this {
    if (isNullish(this.#map)) return this;
    f(this.#map);
    return this;
  }

  modifySources(op: (source: string) => string): this {
    if (isNullish(this.#map)) return this;
    if (this.#map.sources) this.#map.sources = this.#map.sources.map(op);
    return this;
  }

  resolve(dir: string): this {
    return this.modifySources(source => {
      if (source === "<no source>") return source;
      return resolvePath(dir, source);
    });
  }

  relative(dir = process.cwd()): this {
    return this.modifySources(source => {
      if (source === "<no source>") return source;
      if (isAbsolutePath(source)) return relativePath(dir, source);
      else return normalizePath(source);
    });
  }

  toObject(): RawSourceMap | undefined {
    return this.#map;
  }

  toString(): string | undefined {
    if (isNullish(this.#map)) return this.#map;
    return JSON.stringify(this.#map);
  }

  async toConsumer(): Promise<BasicSourceMapConsumer | undefined> {
    if (isNullish(this.#map)) return this.#map;
    return new SourceMapConsumer(this.#map);
  }

  toCommentData(): string {
    const map = this.toString();
    if (isNullish(map)) return "";
    const sourceMapData = Buffer.from(map).toString("base64");
    return `\n/*# sourceMappingURL=data:application/json;base64,${sourceMapData} */`;
  }

  toCommentFile(fileName: string): string {
    if (isNullish(this.#map)) return "";
    return `\n/*# sourceMappingURL=${fileName}.map */`;
  }
}

export const mm = (map?: string | RawSourceMap): MapModifier => new MapModifier(map);
