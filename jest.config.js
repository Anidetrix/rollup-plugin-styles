module.exports = {
  preset: "jest-puppeteer",
  transform: { "^.+\\.jsx?$": "babel-jest", "^.+\\.tsx?$": "ts-jest" },
  globals: { "ts-jest": { packageJson: "package.json" } },
  testMatch: ["<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["expect-puppeteer"],
};
