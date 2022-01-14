const path = require("path");

const modules = [
  "rollup-plugin-lit-css",
  path.join("@pwrs", "lit-css"),
  "string-to-template-literal",
];

const modulesStr = modules.map(m => `.*${m}`).join("|");
const transformIgnorePatterns = [path.join("node_modules", `(?!(${modulesStr})`, ")")];

/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.tsx?$": "ts-jest", "^.+\\.jsx?$": "babel-jest" },
  transformIgnorePatterns,
  globals: { "ts-jest": { tsconfig: { target: "es6", module: "commonjs" } } },
  testMatch: ["<rootDir>/__tests__/*.(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.[jt]s?(x)",
    "<rootDir>/__tests__/*.[jt]s?(x)",
    "<rootDir>/__tests__/helpers/*.[jt]s?(x)",
    "!**/*.d.ts",
    "!**/.eslintrc.js",
  ],
};
