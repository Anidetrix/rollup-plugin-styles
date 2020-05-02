import { terser } from "rollup-plugin-terser";
import autoExternal from "rollup-plugin-auto-external";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";
const extensions = [".ts", ".mjs", ".js", ".json"];
const prod = process.env.NODE_ENV === "production";

export default [
  // Bundle
  {
    input: "src/index.ts",
    output: [
      { format: "cjs", file: pkg.main },
      { format: "es", file: pkg.module },
    ],
    plugins: [
      autoExternal(),
      json(),
      resolve({ preferBuiltins: true, extensions }),
      commonjs(),
      typescript(),
      babel({ exclude: ["**/node_modules/@babel/**"], babelHelpers: "runtime", extensions }),
      prod && terser({ output: { comments: false } }),
    ],
  },
  // Injector
  {
    input: "runtime/inject-css.js",
    output: { format: "es", file: "dist/runtime/inject-css.js" },
    plugins: [
      babel({
        exclude: ["**/node_modules/@babel/**"],
        babelHelpers: "runtime",
        configFile: false,
        presets: [["@babel/preset-env", { modules: false, targets: { ie: "8" } }]],
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
      prod && terser({ ie8: true }),
    ],
  },
  // Declaration
  {
    input: "src/index.ts",
    output: { format: "es", file: pkg.types },
    plugins: [dts()],
  },
];
