import postcss from "postcss";
import urlResolver, { UrlOptions } from "../src/loaders/postcss/url";
// import { fixture } from "./helpers";

const validateUrl = async (
  css: string,
  options: UrlOptions = {},
  from = "dummy",
): Promise<string> => {
  const data = await postcss(urlResolver(options)).process(css, { from });
  const [warning] = data.warnings();
  return warning.text;
};

describe("url resolver", () => {
  it("warns about being empty", async () => {
    const warning = await validateUrl(".foo{background:url()}");
    expect(warning).toMatchInlineSnapshot(`"Empty URL in \`background:url()\`"`);
  });

  it("warns about being unresolved", async () => {
    const warning = await validateUrl(".foo{background:url(bg.png)}");
    expect(warning).toMatchInlineSnapshot(
      `"Unresolved URL \`bg.png\` in \`background:url(bg.png)\`"`,
    );
  });

  it("warns about incorrect resolving", async () => {
    const warning = await validateUrl(".foo{background:url(bg.png)}", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: () => "lol" as any,
    });
    expect(warning).toMatchInlineSnapshot(
      `"Incorrectly resolved URL \`bg.png\` in \`background:url(bg.png)\`"`,
    );
  });
});
