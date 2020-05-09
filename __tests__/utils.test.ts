import loadModule from "../src/utils/load-module";
import { fixture } from "./helpers";
import { mm, getMap, stripMap } from "../src/utils/sourcemap";

describe("load-module", () => {
  test("wrong path", async () => {
    await expect(loadModule("totallyWRONGPATH/here")).resolves.toBeUndefined();
  });

  test("correct cwd path", async () => {
    await expect(loadModule(fixture("utils/fixture"))).resolves.toBe("this is fixture");
  });

  test("correct path with custom basepath", async () => {
    await expect(loadModule("fixture", fixture("utils"))).resolves.toBe("this is fixture");
  });
});

describe("sourcemap-utils", () => {
  test("inline map", async () => {
    let code =
      '.foo {color: red;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAG1BMVEXMzMyWlpacnJy+vr6jo6PFxcW3t7eqqqqxsbHbm8QuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAiklEQVRYhe3QMQ6EIBAF0C+GSInF9mYTs+1ewRsQbmBlayysKefYO2asXbbYxvxHQj6ECQMAEREREf2NQ/fCtp5Zky6vtRMkSJEzhyISynWJnzH6Z8oQlzS7lEc/fLmmQUSvc16OrCPqRl1JePxQYo1ZSWVj9nxrrOb5esw+eXdvzTWfTERERHRXH4tWFZGswQ2yAAAAAElFTkSuQmCC");}';

    await expect(getMap(code)).resolves.toBeUndefined();

    code +=
      "/*# sourceMappingURL=data:application/json;base64,e1RISVM6SVNBU09VUkNFTUFQU0lNVUxBVElPTn0= */";

    await expect(getMap(code)).resolves.toBe("{THIS:ISASOURCEMAPSIMULATION}");
  });

  test("file map", async () => {
    const code = ".foo {color: red;}/*# sourceMappingURL=fixture.css.map */";

    await expect(getMap(code)).rejects.toMatchInlineSnapshot(
      `[Error: Extracted map detected, but no ID is provided]`,
    );

    await expect(getMap(code, "this/is/nonexistant/path.css")).resolves.toBeUndefined();

    await expect(getMap(code, fixture("utils/pointless.css"))).resolves.toBe(
      "{THIS:ISASOURCEMAPSIMULATION}",
    );
  });

  test("strip map", () => {
    const code = ".foo {color: red;}/*# sourceMappingURL=fixture.css.map */";
    expect(stripMap(code)).toBe(".foo {color: red;}");
  });

  test("map modifier", () => {
    const map = JSON.stringify({ sources: ["../a/b/../foo/bar.css", "../b/a/../bar/foo.css"] });
    const relativeSrc = JSON.stringify(mm(map).relative().toObject()?.sources);
    expect(relativeSrc).toBe(JSON.stringify(["../a/foo/bar.css", "../b/bar/foo.css"]));
    expect(mm("thisisnotjson").toString()).toBeUndefined();
  });
});
