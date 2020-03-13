const path = require("path");
module.exports = {
  root: true,
  extends: [path.resolve(__dirname, "..", "..", ".eslintrc.js")],
  env: { node: false, browser: true },
  rules: { "prefer-const": "error" },
};
