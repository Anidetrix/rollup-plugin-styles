const tasks = arr => arr.join(" && ");

module.exports = {
  hooks: {
    "pre-commit": tasks(["npm run test", "npm run docgen", "git add docs", "lint-staged"]),
  },
};
