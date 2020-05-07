import { rollup } from "rollup";

import styles from "../src";
import litcss from "rollup-plugin-lit-css";

import { fixture, validateMany, write } from "./helpers";

validateMany("basic", [
  {
    title: "simple",
    input: "simple/index.js",
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
      alias: { "@": fixture("resolvers/features2") },
      url: { publicPath: "/pubpath", hash: "[name][extname]" },
    },
    outputOpts: {
      assetFileNames: "[name][extname]",
    },
    files: [
      "bg.png",
      "bg.testing.regex.png",
      "bg1.png",
      "bg1.testing.regex.png",
      "bg2.testing.regex.png",
      "cat-2x.png",
      "cat-print.png",
      "cat.png",
    ],
  },
  {
    title: "resolvers-url-inline",
    input: "resolvers/index.js",
    options: {
      mode: "extract",
      alias: { "@": fixture("resolvers/features2") },
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
      styles({ extensions: [], use: ["less"] }),
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
]);

validateMany("emit", [
  {
    title: "true",
    input: "emit/index.js",
    plugins: [
      styles({ mode: "emit", plugins: [["autoprefixer", { overrideBrowserslist: ["> 0%"] }]] }),
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
