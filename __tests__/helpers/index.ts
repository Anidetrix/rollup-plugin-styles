/* eslint-disable jest/no-export */
import path from "path";
import fs from "fs-extra";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";

import styles from "../../src";
import { Options } from "../../src/types";

export interface WriteData {
  input: string;
  outDir?: string;
  options?: Options;
}

export interface Test extends WriteData {
  title: string;
}

export interface TestData {
  js: () => Promise<string>;
  css: () => Promise<string>;
  map: () => Promise<string>;
  isCss: () => Promise<boolean>;
  isMap: () => Promise<boolean>;
  isFile: (filename: string) => Promise<boolean>;
}

export const fixture = (...args: string[]): string =>
  path.normalize(path.join(__dirname, "..", "fixtures", ...args));

export async function write(data: WriteData): Promise<TestData> {
  const outDir = fixture("dist", data.outDir || "");

  const bundle = await rollup({
    input: fixture(data.input),
    plugins: [commonjs(), styles(data.options)],
  });

  await bundle.write({
    format: "cjs",
    file: path.join(outDir, "bundle.js"),
  });

  const js = path.join(outDir, "bundle.js");
  const css =
    data.options && typeof data.options.extract === "string"
      ? data.options.extract
      : path.join(outDir, "bundle.css");
  const map = `${css}.map`;

  const resData: TestData = {
    js: () => fs.readFile(js, "utf8"),
    css: () => fs.readFile(css, "utf8"),
    map: () => fs.readFile(map, "utf8"),
    isCss: () => fs.pathExists(css),
    isMap: () => fs.pathExists(map),
    isFile: (file: string) => fs.pathExists(path.join(outDir, file)),
  };

  return resData;
}

export function validate({ title, input, outDir, options = {} }: Test): void {
  test(
    title,
    async () => {
      let res;
      try {
        res = await write({ input, outDir, options });
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
    },
    30000,
  );
}

export function validateMany(groupName: string, tests: Test[]): void {
  describe(groupName, () => {
    for (const test of tests) {
      validate({
        ...test,
        outDir: path.join(groupName, test.title),
      });
    }
  });
}
