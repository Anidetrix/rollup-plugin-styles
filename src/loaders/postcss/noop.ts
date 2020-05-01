import postcss from "postcss";

const name = "styles-noop";

const noop = (): void => {
  /* noop */
};

export default postcss.plugin(name, () => noop);
