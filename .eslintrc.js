const extensions = [".mjs", ".js", ".cjs", ".json"];
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  env: { node: true, browser: false, es6: true },
  parserOptions: { sourceType: "module" },
  plugins: ["unicorn"],
  rules: {
    "no-await-in-loop": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "sort-vars": "error",
    "unicorn/no-null": "off",
    "unicorn/prefer-json-parse-buffer": "off",
    "unicorn/prefer-module": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prefer-set-has": "off",
    "unicorn/prevent-abbreviations": "off",
    yoda: ["error", "never", { exceptRange: true }],
  },
  settings: { "import/resolver": { node: { extensions } } },
};
