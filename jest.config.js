module.exports = {
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  transform: { "^.+\\.tsx?$": "ts-jest" },
  globals: { "ts-jest": { packageJson: "package.json", tsConfig: { target: "es6" } } },
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
