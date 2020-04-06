/* eslint-disable jest/no-export */
import path from "path";
import fs from "fs-extra";
import { rollup, Plugin } from "rollup";

import styles from "../../src";
import { Options } from "../../src/types";

export interface WriteData {
  input: string;
  outDir?: string;
  options?: Options;
  plugins?: Plugin[];
}

export interface WriteResult {
  js: () => Promise<string>;
  css: () => Promise<string>;
  map: () => Promise<string>;
  isCss: () => Promise<boolean>;
  isMap: () => Promise<boolean>;
  isFile: (filename: string) => Promise<boolean>;
}

export const fixture = (...args: string[]): string =>
  path.normalize(path.join(__dirname, "..", "fixtures", ...args));

export async function write(data: WriteData): Promise<WriteResult> {
  const outDir = fixture("dist", data.outDir || "");

  const js = path.join(outDir, "bundle.js");
  const css =
    data.options && typeof data.options.extract === "string"
      ? data.options.extract
      : path.join(outDir, "bundle.css");
  const map = `${css}.map`;

  const bundle = await rollup({
    input: fixture(data.input),
    plugins: data.plugins || [styles(data.options)],
  });

  await bundle.write({ format: "cjs", file: js });

  const res: WriteResult = {
    js: () => fs.readFile(js, "utf8"),
    css: () => fs.readFile(css, "utf8"),
    map: () => fs.readFile(map, "utf8"),
    isCss: () => fs.pathExists(css),
    isMap: () => fs.pathExists(map),
    isFile: file => fs.pathExists(path.join(outDir, file)),
  };

  return res;
}

export interface TestData extends WriteData {
  title: string;
}

export function validate(data: TestData): void {
  const options = data.options || {};
  test(data.title, async () => {
    let res;
    try {
      res = await write(data);
    } catch (error) {
      const frame = error.codeFrame || error.snippet;
      if (frame) throw new Error(`${frame} ${error.message}`);
      throw error;
    }

    await expect(res.js()).resolves.toMatchSnapshot("js");

    if (options.extract) {
      await expect(res.isCss()).resolves.toBeTruthy();
      await expect(res.css()).resolves.toMatchSnapshot("css");
    }

    const sourceMap = options && options.sourceMap;
    if (sourceMap === "inline") {
      await expect(res.isMap()).resolves.toBeFalsy();
    } else if (sourceMap === true) {
      await expect(res.isMap()).resolves.toBe(Boolean(options.extract));
      if (options.extract) await expect(res.map()).resolves.toMatchSnapshot("map");
    }
  });
}

export function validateMany(groupName: string, testDatas: TestData[]): void {
  describe(groupName, () => {
    for (const testData of testDatas) {
      validate({ ...testData, outDir: path.join(groupName, testData.title) });
    }
  });
}
