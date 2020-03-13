const tasks = arr => arr.join(" && ");

module.exports = {
  hooks: {
    "pre-commit": tasks(["npm run docgen", "git add --all docs", "lint-staged"]),
  },
};
