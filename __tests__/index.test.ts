import fs from "fs-extra";
import { rollup } from "rollup";
import { RawSourceMap } from "source-map";

import styles from "../src";
import litcss from "rollup-plugin-lit-css";

import { fixture, validateMany, write } from "./helpers";

beforeAll(async () => fs.remove(fixture("dist")));

validateMany("basic", [
  {
    title: "simple",
    input: "simple/index.js",
  },
  {
    title: "use-fail",
    shouldFail: true,
    input: "simple/index.js",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment
    options: { use: [false] as any },
  },
  {
    title: "postcss-config",
    input: "postcss-config/index.js",
  },
  {
    title: "resolvers",
    input: "resolvers/index.js",
    options: {
      mode: "extract",
      alias: { "@": fixture("resolvers/features") },
      url: { publicPath: "/pubpath", hash: false },
    },
    outputOpts: {
      assetFileNames: "[name][extname]",
    },
    files: [
      "assets/bg.png",
      "assets/bg.testing.regex.png",
      "assets/bg1.png",
      "assets/bg1.testing.regex.png",
      "assets/bg2.testing.regex.png",
      "assets/cat-2x.png",
      "assets/cat-print.png",
      "assets/cat.png",
    ],
  },
  {
    title: "resolvers-url-inline",
    input: "resolvers/index.js",
    options: {
      mode: "extract",
      alias: { "@": fixture("resolvers/features") },
      url: { inline: true },
    },
  },
  {
    title: "skip-loader",
    input: "skip-loader/index.js",
    options: {
      use: ["loader"],
      loaders: [
        {
          name: "loader",
          test: /\.random$/,
          process: (): never => "lol" as never,
        },
      ],
    },
  },
  {
    title: "postcss-options",
    input: "postcss-options/index.js",
    options: {
      parser: "sugarss",
      plugins: [["autoprefixer", { overrideBrowserslist: ["> 0%"] }]],
    },
  },
]);

validateMany("minimize", [
  {
    title: "inject",
    input: "simple/index.js",
    options: {
      minimize: true,
    },
  },
  {
    title: "extract",
    input: "simple/index.js",
    options: {
      minimize: true,
      mode: "extract",
    },
  },
  {
    title: "extract-sourcemap-true",
    input: "simple/index.js",
    options: {
      minimize: true,
      mode: "extract",
      sourceMap: true,
    },
  },
  {
    title: "extract-sourcemap-inline",
    input: "simple/index.js",
    options: {
      minimize: true,
      mode: "extract",
      sourceMap: "inline",
    },
  },
]);

validateMany("modules", [
  {
    title: "inject",
    input: "modules/index.js",
    options: { modules: true },
  },
  {
    title: "inject-object",
    input: "modules/index.js",
    options: {
      modules: {
        getReplacements(): void {
          /* noop */
        },
      },
    },
  },
  {
    title: "named-exports",
    input: "named-exports/index.js",
    options: { modules: true, namedExports: true },
  },
  {
    title: "named-exports-custom-class-name",
    input: "named-exports/index.js",
    options: {
      modules: true,
      namedExports: (name): string => `${name}hacked`,
    },
  },
  {
    title: "extract",
    input: "modules/index.js",
    options: { modules: true, mode: "extract" },
  },
  {
    title: "extract-sourcemap-true",
    input: "modules/index.js",
    options: { modules: true, mode: "extract", sourceMap: true },
  },
  {
    title: "extract-sourcemap-inline",
    input: "modules/index.js",
    options: { modules: true, mode: "extract", sourceMap: "inline" },
  },
  {
    title: "auto-modules",
    input: "auto-modules/index.js",
    options: { autoModules: true },
  },
  {
    title: "auto-modules-regexp",
    input: "auto-modules/index.js",
    options: { autoModules: /(?<!\.module\.)\.styl/ },
  },
  {
    title: "auto-modules-fn",
    input: "auto-modules/index.js",
    options: { autoModules: (id): boolean => id.endsWith(".less") },
  },
  {
    title: "duplication",
    input: "modules-duplication/index.js",
    options: { modules: true, mode: "extract" },
  },
]);

validateMany("sourcemap", [
  {
    title: "true",
    input: "simple/index.js",
    options: { sourceMap: true },
  },
  {
    title: "inline",
    input: "simple/index.js",
    options: { sourceMap: "inline" },
  },
]);

validateMany("extract", [
  {
    title: "true",
    input: "simple/index.js",
    options: { mode: "extract" },
  },
  {
    title: "absolute-path-fail",
    shouldFail: true,
    input: "simple/index.js",
    options: { mode: ["extract", fixture("dist/wrong.css")] },
  },
  {
    title: "relative-path-fail",
    shouldFail: true,
    input: "simple/index.js",
    options: { mode: ["extract", "../wrong.css"] },
  },
  {
    title: "custom-path",
    input: "simple/index.js",
    options: {
      mode: ["extract", "i/am/extracted.css"],
      sourceMap: true,
    },
  },
  {
    title: "sourcemap-true",
    input: "simple/index.js",
    options: { mode: "extract", sourceMap: true },
  },
  {
    title: "sourcemap-inline",
    input: "simple/index.js",
    options: { mode: "extract", sourceMap: "inline" },
  },
]);

validateMany("inject", [
  {
    title: "top",
    input: "simple/index.js",
    options: {
      mode: ["inject", { prepend: true }],
    },
  },
  {
    title: "function",
    input: "simple/index.js",
    options: {
      mode: ["inject", (varname): string => `console.log(${varname})`],
    },
  },
]);

validateMany("sass", [
  {
    title: "default",
    input: "sass/index.js",
  },
  {
    title: "use",
    input: "sass-use/index.js",
    options: { sass: { impl: "sass" } },
  },
  {
    title: "sourcemap",
    input: "sass/index.js",
    options: {
      sourceMap: true,
    },
  },
  {
    title: "modules",
    input: "sass-modules/index.js",
    options: {
      modules: true,
    },
  },
  {
    title: "data",
    input: "sass-data/index.js",
    options: {
      sass: { data: "@import 'data';" },
    },
  },
  {
    title: "import",
    input: "sass-import/index.js",
  },
]);

validateMany("less", [
  {
    title: "import",
    input: "less-import/index.js",
  },
]);

validateMany("multiple-instances", [
  {
    title: "default",
    input: "multiple-instances/index.js",
    plugins: [
      styles({ extensions: [".css"], use: [] }),
      styles({ extensions: [], use: ["less", "sass", "stylus"] }),
      styles({ extensions: [".mcss"], use: [], modules: true, namedExports: true }),
    ],
  },
  {
    title: "already-processed",
    input: "multiple-instances/bar.less",
    plugins: [styles({ modules: true, namedExports: true }), styles()],
  },
]);

validateMany("code-splitting", [
  {
    title: "true",
    input: "code-splitting/index.js",
    options: {
      mode: "extract",
      modules: true,
      sourceMap: true,
    },
  },
  {
    title: "single",
    input: "code-splitting/index.js",
    options: {
      mode: ["extract", "extracted.css"],
      modules: true,
      sourceMap: true,
    },
  },
  {
    title: "multi-entry",
    input: {
      entry1: "code-splitting/index.js",
      entry2: "code-splitting/index2.js",
    },
    options: {
      mode: "extract",
      modules: true,
      sourceMap: true,
    },
  },
  {
    title: "multi-entry-single",
    input: {
      entry1: "code-splitting/index.js",
      entry2: "code-splitting/index2.js",
    },
    options: {
      mode: ["extract", "extracted.css"],
      modules: true,
      sourceMap: true,
    },
  },
]);

validateMany("emit", [
  {
    title: "true",
    input: "emit/index.js",
    plugins: [
      styles({
        mode: "emit",
        minimize: true,
        plugins: [["autoprefixer", { overrideBrowserslist: ["> 0%"] }]],
      }),
      litcss(),
    ],
  },
]);

test("on-extract-fn", async () => {
  const res = await write({
    input: "simple/index.js",
    outDir: "on-extract-fn",
    options: {
      mode: "extract",
      onExtract(): boolean {
        return false;
      },
    },
  });
  for (const f of await res.js()) expect(f).toMatchSnapshot("js");
  await expect(res.isCss()).resolves.toBeFalsy();
  await expect(res.isMap()).resolves.toBeFalsy();
});

test("nested", async () => {
  const outDir = fixture("dist/nested");
  const bundle = await rollup({
    input: fixture("simple/index.js"),
    plugins: [styles({ mode: "extract", sourceMap: true })],
  });
  await bundle.write({ dir: outDir, assetFileNames: "this/is/nested/[name][extname]" });
  const outMap = `${outDir}/this/is/nested/index.css.map`;
  await expect(fs.pathExists(outMap)).resolves.toBeTruthy();
  const map = JSON.parse(await fs.readFile(outMap, "utf8")) as RawSourceMap;
  const inSource = `${outDir}/this/is/nested/${map.sources[0]}`;
  await expect(fs.pathExists(inSource)).resolves.toBeTruthy();
  const source = await fs.readFile(inSource, "utf8");
  expect(map.sourcesContent && map.sourcesContent[0]).toBe(source);
});

test("augment-chunk-hash", async () => {
  const outDir = fixture("dist/augment-chunk-hash");
  const cssFiles = ["simple/foo.css", "simple/bar.css", "simple/foo.css"];

  const outputFiles: string[] = [];
  for await (const file of cssFiles) {
    const bundle = await rollup({
      input: fixture(file),
      plugins: [styles({ mode: "extract", sourceMap: "inline" })],
    });
    const { output } = await bundle.write({
      dir: outDir,
      entryFileNames: `[name].[hash].js`,
    });
    outputFiles.push(output[0].fileName);
  }

  const [foo1, bar, foo2] = outputFiles;

  const foo1Hash = foo1.split(".")[1];
  const foo2Hash = foo1.split(".")[1];
  const barHash = bar.split(".")[1];

  // Verify that [hash] part of the filenames is truthy
  expect(foo1Hash).toBeTruthy();
  expect(foo2Hash).toBeTruthy();
  expect(barHash).toBeTruthy();

  // Verify that the `foo` have the same filename and hash
  expect(foo1).toEqual(foo2);
  expect(foo1Hash).toEqual(foo2Hash);

  // Verify that `foo` and `bar` have different filename and hash
  expect(bar).not.toEqual(foo1);
  expect(bar).not.toEqual(foo2);
  expect(barHash).not.toEqual(foo1Hash);
  expect(barHash).not.toEqual(foo2Hash);
});
