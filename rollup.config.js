/* eslint node/no-unsupported-features/es-syntax: ["error", { ignores: ["modules"] }] */

import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";
const extensions = [".ts", ".mjs", ".js", ".json"];

export default [
  // Bundle
  {
    input: "src/index.ts",
    output: [
      { format: "cjs", file: pkg.main },
      { format: "es", file: pkg.module },
    ],
    plugins: [
      externals({ deps: true }),
      replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
      json(),
      resolve({ preferBuiltins: true, extensions }),
      commonjs(),
      typescript(),
      babel({ babelHelpers: "bundled", extensions }),
    ],
  },
  // Injector
  {
    input: "runtime/inject-css.js",
    output: { format: "es", file: "dist/runtime/inject-css.js" },
    plugins: [
      externals({ deps: true }),
      json(),
      resolve({ preferBuiltins: true }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        configFile: false,
        presets: [["@babel/preset-env", { modules: false, targets: { ie: "8" } }]],
      }),
      terser({ output: { comments: false }, ie8: true, safari10: true }),
    ],
  },
  // Declaration
  {
    input: "src/index.ts",
    output: { format: "es", file: pkg.types },
    plugins: [externals({ deps: true }), dts({ respectExternal: true })],
  },
];
