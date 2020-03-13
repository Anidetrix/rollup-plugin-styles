import postcss from "postcss";

// Prevent from postcss warning:
// You did not set any plugins, parser, or stringifier. Right now, PostCSS does nothing. Pick plugins for your case on https://www.postcss.parts/ and use them in postcss.config.js

const name = "postcss-noop-plugin";

const noop = (): void => {
  /* noop */
};

export default postcss.plugin(name, () => noop);
