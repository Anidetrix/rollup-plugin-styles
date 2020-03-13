module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:unicorn/recommended",
    "plugin:node/recommended",
    "prettier",
    "prettier/unicorn",
  ],
  env: { node: true, browser: false, es6: true },
  parserOptions: { sourceType: "module" },
  plugins: ["unicorn", "node"],
  rules: {
    "no-var": "error",
    "prefer-template": "error",
    "unicorn/prevent-abbreviations": "off",
    "node/no-missing-import": "off",
    "node/file-extension-in-import": "off",
    "node/no-unsupported-features/es-syntax": "off",
  },
  settings: { "import/resolver": { node: { extensions: [".js", ".ts"] } } },
};
