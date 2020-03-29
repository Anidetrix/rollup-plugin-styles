import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from "rollup-plugin-auto-external";
import ts from "@wessberg/rollup-plugin-ts";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

export default [
  // Bundle
  {
    input: "src/index.ts",
    output: [
      { format: "cjs", file: pkg.main },
      { format: "esm", file: pkg.module },
    ],
    plugins: [
      autoExternal(),
      json(),
      replace({ "process.env.STYLES_TEST": false }),
      resolve({
        preferBuiltins: true,
        extensions: [".ts", ".mjs", ".js", ".json"],
      }),
      commonjs(),
      ts({ transpiler: "babel" }),
      terser(),
    ],
  },
  // Declaration
  {
    input: "src/index.ts",
    output: [{ format: "es", file: pkg.types }],
    plugins: [dts()],
  },
];
