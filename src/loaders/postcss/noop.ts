import postcss from "postcss";

const name = "styles-noop";

function noop(): void {
  /* noop */
}

export default postcss.plugin(name, () => noop);
