import path from "path";
import fs from "fs-extra";
import { rollup } from "rollup";

import styles from "../src";

import { fixture, validateMany, write } from "./helpers";
import { humanlizePath } from "../src/utils/path-utils";

beforeAll(() => fs.remove(fixture("dist")));

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
    title: "postcss-resolvers",
    input: "postcss-resolvers/index.js",
    options: {
      extract: fixture("dist/basic/postcss-resolvers/bundle.css"),
      sourceMap: true,
      modules: true,
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
      plugins: ["postcss-import", ["autoprefixer", { overrideBrowserslist: ["> 0%"] }]],
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
      extract: true,
    },
  },
  {
    title: "extract-sourcemap-true",
    input: "simple/index.js",
    options: {
      minimize: true,
      extract: true,
      sourceMap: true,
    },
  },
  {
    title: "extract-sourcemap-inline",
    input: "simple/index.js",
    options: {
      minimize: true,
      extract: true,
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
        getJSON(): void {
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
    options: { modules: true, extract: true },
  },
  {
    title: "extract-sourcemap-true",
    input: "modules/index.js",
    options: { modules: true, extract: true, sourceMap: true },
  },
  {
    title: "extract-sourcemap-inline",
    input: "modules/index.js",
    options: { modules: true, extract: true, sourceMap: "inline" },
  },
  {
    title: "auto-modules",
    input: "auto-modules/index.js",
    options: { autoModules: true },
  },
  {
    title: "duplication",
    input: "modules-duplication/index.js",
    options: { modules: true, extract: true },
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
    options: { extract: true },
  },
  {
    title: "custom-path-absolute",
    input: "simple/index.js",
    options: {
      extract: fixture("dist", "extract", "custom-path-absolute", "this", "is", "extracted.css"),
      sourceMap: true,
    },
  },
  {
    title: "custom-path-relative",
    input: "simple/index.js",
    options: {
      extract: humanlizePath(
        fixture("dist", "extract", "custom-path-relative", "i", "am", "extracted.css"),
      ),
      sourceMap: true,
    },
  },
  {
    title: "sourcemap-true",
    input: "simple/index.js",
    options: { extract: true, sourceMap: true },
  },
  {
    title: "sourcemap-inline",
    input: "simple/index.js",
    options: { extract: true, sourceMap: "inline" },
  },
]);

validateMany("inject", [
  {
    title: "top",
    input: "simple/index.js",
    options: {
      inject: { prepend: true },
    },
  },
  {
    title: "function",
    input: "simple/index.js",
    options: {
      inject: (varname): string => `console.log(${varname})`,
    },
  },
  {
    title: "false",
    input: "simple/index.js",
    options: {
      inject: false,
    },
  },
]);

validateMany("sass", [
  {
    title: "default",
    input: "sass/index.js",
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
      use: {
        sass: { data: "@import 'data';" },
      },
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

test("on-extract-fn", async () => {
  const res = await write({
    input: "simple/index.js",
    outDir: "on-extract-fn",
    options: {
      extract: true,
      onExtract(): boolean {
        return false;
      },
    },
  });
  await expect(res.js()).resolves.toMatchSnapshot();
  await expect(res.isCss()).resolves.toBeFalsy();
  await expect(res.isMap()).resolves.toBeFalsy();
});

test("augment-chunk-hash", async () => {
  const outDir = fixture("dist", "augment-chunk-hash");
  const cssFiles = ["simple/foo.css", "simple/foo.css", "simple/bar.css"];

  const outputFiles: string[] = [];
  for await (const file of cssFiles) {
    const bundle = await rollup({
      input: fixture(file),
      plugins: [styles({ extract: true, sourceMap: "inline" })],
    });
    const entryFileName = file.split(".")[0];
    const { output } = await bundle.write({
      dir: outDir,
      entryFileNames: `${entryFileName}.[hash].css`,
    });
    outputFiles.push(output[0].fileName);
  }

  const [fooOne, fooTwo, bar] = outputFiles;

  const fooOneHash = fooOne.split(".")[1];
  const fooTwoHash = fooOne.split(".")[1];
  const barHash = bar.split(".")[1];

  // Verify that [hash] part of `foo.[hash].css` is truthy
  expect(fooOneHash).toBeTruthy();
  expect(fooTwoHash).toBeTruthy();
  expect(barHash).toBeTruthy();

  // Verify that the foo hashes to the same fileName
  expect(fooOne).toEqual(fooTwo);
  expect(fooOneHash).toEqual(fooTwoHash);

  // Verify that foo and bar does not hash to the same
  expect(barHash).not.toEqual(fooOneHash);
  expect(barHash).not.toEqual(fooTwoHash);
});

test("already-processed", async () => {
  const bundle = await rollup({
    input: fixture("simple/foo.css"),
    plugins: [styles(), styles()],
  });

  const outDir = fixture("dist", "already-processed");
  const { output } = await bundle.write({ dir: outDir });
  const outfile = path.join(outDir, output[0].fileName);

  await expect(fs.pathExists(outfile)).resolves.toBeTruthy();
  await expect(fs.readFile(outfile, "utf8")).resolves.toMatchSnapshot("js");
});

test("multiple-instances", async () => {
  const bundle = await rollup({
    input: fixture("multiple-instances/index.js"),
    plugins: [
      styles({ extensions: [".css"], use: [] }),
      styles({ extensions: [], use: ["less"] }),
      styles({
        extensions: [".mcss"],
        use: [],
        modules: true,
        namedExports: name => `${name}alt`,
      }),
    ],
  });

  const outDir = fixture("dist", "multiple-instances");
  const { output } = await bundle.write({ dir: outDir });
  const outfile = path.join(outDir, output[0].fileName);

  await expect(fs.pathExists(outfile)).resolves.toBeTruthy();
  await expect(fs.readFile(outfile, "utf8")).resolves.toMatchSnapshot("js");
});
