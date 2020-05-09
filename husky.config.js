const tasks = arr => arr.join(" && ");

module.exports = {
  hooks: {
    "pre-commit": tasks(["pnpm t -- --no-cache", "lint-staged"]),
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  },
};
