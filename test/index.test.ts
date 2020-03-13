import fs from "fs-extra";
import path from "path";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "../src";
import { Options } from "../src/types";

process.env.ROLLUP_POSTCSS_TEST = "true";

// Types
interface WriteData {
  input: string;
  outDir?: string;
  options?: Options;
}

interface Test extends WriteData {
  title: string;
}

interface TestData {
  js: () => Promise<string>;
  css: () => Promise<string>;
  map: () => Promise<string>;
  isCss: () => Promise<boolean>;
  isMap: () => Promise<boolean>;
  isFile: (filename: string) => Promise<boolean>;
}

// Helpers
function fixture(...args: string[]): string {
  return path.join(__dirname, "fixtures", ...args);
}

async function write(data: WriteData): Promise<TestData> {
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

function validate({ title, input, outDir, options = {} }: Test): void {
  test(title, async () => {
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
  });
}

function validateMany(groupName: string, tests: Test[]): void {
  describe(groupName, () => {
    for (const test of tests) {
      validate({
        ...test,
        outDir: path.join(groupName, test.title),
      });
    }
  });
}

// Tests
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      plugins: [require("autoprefixer")({ overrideBrowserslist: ["> 0%"] })],
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
    options: {
      modules: true,
    },
  },
  {
    title: "doubling",
    input: "modules-doubling/index.js",
    options: {
      modules: true,
      extract: true,
    },
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
    options: {
      modules: true,
      namedExports: true,
    },
  },
  {
    title: "named-exports-custom-class-name",
    input: "named-exports/index.js",
    options: {
      modules: true,
      namedExports: (name): string => {
        return `${name}hacked`;
      },
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
    title: "custom-path",
    input: "simple/index.js",
    options: {
      extract: fixture("dist/extract/custom-path/this/is/extracted.css"),
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
  expect(await res.js()).toMatchSnapshot();
  expect(await res.isCss()).toBeFalsy();
  expect(await res.isMap()).toBeFalsy();
});

test("augment-chunk-hash", async () => {
  const outDir = fixture("dist", "augment-chunk-hash");
  const cssFiles = ["simple/foo.css", "simple/foo.css", "simple/bar.css"];

  const outputFiles: string[] = [];
  for (const file of cssFiles) {
    const bundle = await rollup({
      input: fixture(file),
      plugins: [postcss({ extract: true, sourceMap: "inline" })],
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
