/* eslint-disable jest/no-export */
import path from "path";
import fs from "fs-extra";
import { Plugin, rollup, OutputOptions } from "rollup";

import styles from "../../src";
import { Options } from "../../src/types";
import { inferModeOption } from "../../src/utils/options";

export type WriteData = {
  input: string;
  outDir?: string;
  options?: Options;
  plugins?: Plugin[];
  outputOpts?: OutputOptions;
};

export type WriteResult = {
  js: () => Promise<string[]>;
  css: () => Promise<string[]>;
  isCss: () => Promise<boolean>;
  map: () => Promise<string[]>;
  isMap: () => Promise<boolean>;
  isFile: (file: string) => Promise<boolean>;
};

export const fixture = (...args: string[]): string =>
  path.normalize(path.join(__dirname, "..", "fixtures", ...args));

export async function write(data: WriteData): Promise<WriteResult> {
  const outDir = fixture("dist", data.outDir ?? "");

  const bundle = await rollup({
    input: fixture(data.input),
    plugins: data.plugins ?? [styles(data.options)],
    onwarn: (warning, warn) => {
      if (warning.code === "EMPTY_BUNDLE") return;
      if (warning.source === "lit-element") return;
      if (/Exported `\S+` as `\S+` in \S+/.test(warning.message)) return;
      warn(warning);
    },
  });

  const { output } = await bundle.write({
    ...data.outputOpts,
    dir: outDir,
  });

  const js = output
    .filter(f => f.type === "chunk")
    .map(f => path.join(outDir, f.fileName))
    .sort();

  const css = output
    .filter(f => f.type === "asset" && f.fileName.endsWith(".css"))
    .map(f => path.join(outDir, f.fileName))
    .sort();

  const map = output
    .filter(f => f.type === "asset" && f.fileName.includes(".css") && f.fileName.endsWith(".map"))
    .map(f => path.join(outDir, f.fileName))
    .sort();

  const res: WriteResult = {
    js: async () => Promise.all(js.map(async f => fs.readFile(f, "utf8"))),

    css: async () => Promise.all(css.map(async f => fs.readFile(f, "utf8"))),
    isCss: async () =>
      css.length > 0 &&
      css.reduce(
        async (prevExists, f) => (await prevExists) && (await fs.pathExists(f)),
        Promise.resolve(true),
      ),

    map: async () => Promise.all(map.map(async f => fs.readFile(f, "utf8"))),
    isMap: async () =>
      map.length > 0 &&
      map.reduce(
        async (prevExists, f) => (await prevExists) && (await fs.pathExists(f)),
        Promise.resolve(true),
      ),

    isFile: async file => fs.pathExists(path.join(outDir, file)),
  };

  return res;
}

export type TestData = WriteData & { title: string; files?: string[] };

export function validate(data: TestData): void {
  const options = data.options ?? {};
  const mode = inferModeOption(options.mode);
  test(data.title, async () => {
    const res = await write(data);

    for (const f of await res.js()) expect(f).toMatchSnapshot("js");

    if (mode.extract) {
      await expect(res.isCss()).resolves.toBeTruthy();
      for (const f of await res.css()) expect(f).toMatchSnapshot("css");
    }

    if (options.sourceMap === "inline") {
      await expect(res.isMap()).resolves.toBeFalsy();
    } else if (options.sourceMap === true) {
      await expect(res.isMap()).resolves.toBe(Boolean(mode.extract));
      if (mode.extract) for (const f of await res.map()) expect(f).toMatchSnapshot("map");
    }

    if (data.files) {
      for await (const f of data.files) await expect(res.isFile(f)).resolves.toBeTruthy();
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
