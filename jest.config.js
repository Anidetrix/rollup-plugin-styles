module.exports = {
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  transform: { "^.+\\.tsx?$": "ts-jest" },
  globals: { "ts-jest": { packageJson: "package.json" } },
  testMatch: ["<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
};
