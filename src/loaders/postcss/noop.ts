import postcss from "postcss";

const name = "postcss-noop-plugin";

const noop = (): void => {
  /* noop */
};

export default postcss.plugin(name, () => noop);
