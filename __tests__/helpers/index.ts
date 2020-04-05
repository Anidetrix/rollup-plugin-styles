/* eslint-disable jest/no-export */
import path from "path";
import fs from "fs-extra";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";

import postcss from "../../src";
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
    plugins: [commonjs(), postcss(data.options)],
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

      expect(await res.js()).toMatchSnapshot("js");

      if (options.extract) {
        expect(await res.isCss()).toBeTruthy();
        expect(await res.css()).toMatchSnapshot("css");
      }

      const sourceMap = options && options.sourceMap;
      if (sourceMap === "inline") {
        expect(await res.isMap()).toBeFalsy();
      } else if (sourceMap === true) {
        expect(await res.isMap()).toBe(Boolean(options.extract));
        if (options.extract) expect(await res.map()).toMatchSnapshot("map");
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
