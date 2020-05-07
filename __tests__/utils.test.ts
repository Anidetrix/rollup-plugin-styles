import loadModule from "../src/utils/load-module";
import { fixture } from "./helpers";
import { mm, getMap, stripMap } from "../src/utils/sourcemap";

describe("load-module", () => {
  test("wrong path", async () => {
    const wrong = await loadModule("totallyWRONGPATH/here");
    expect(wrong).toBeUndefined();
  });

  test("correct cwd path", async () => {
    const correct = await loadModule(fixture("utils/fixture"));
    expect(correct).toBe("this is fixture");
  });

  test("correct path with custom basepath", async () => {
    const correct = await loadModule("fixture", fixture("utils"));
    expect(correct).toBe("this is fixture");
  });
});

describe("sourcemap-utils", () => {
  test("inline map", async () => {
    let code =
      '.foo {color: red;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAG1BMVEXMzMyWlpacnJy+vr6jo6PFxcW3t7eqqqqxsbHbm8QuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAiklEQVRYhe3QMQ6EIBAF0C+GSInF9mYTs+1ewRsQbmBlayysKefYO2asXbbYxvxHQj6ECQMAEREREf2NQ/fCtp5Zky6vtRMkSJEzhyISynWJnzH6Z8oQlzS7lEc/fLmmQUSvc16OrCPqRl1JePxQYo1ZSWVj9nxrrOb5esw+eXdvzTWfTERERHRXH4tWFZGswQ2yAAAAAElFTkSuQmCC");}';
    const noMap = await getMap(code);
    expect(noMap).toBeUndefined();
    code +=
      "/*# sourceMappingURL=data:application/json;base64,e1RISVM6SVNBU09VUkNFTUFQU0lNVUxBVElPTn0= */";
    const correctMap = await getMap(code);
    expect(correctMap).toBe("{THIS:ISASOURCEMAPSIMULATION}");
  });

  test("file map", async () => {
    const code = ".foo {color: red;}/*# sourceMappingURL=fixture.css.map */";
    const noPathMap = await getMap(code);
    expect(noPathMap).toBeUndefined();
    const wrongPathMap = await getMap(code, "this/is/nonexistant/path.css");
    expect(wrongPathMap).toBeUndefined();
    const correctMap = await getMap(code, fixture("utils/pointless.css"));
    expect(correctMap).toBe("{THIS:ISASOURCEMAPSIMULATION}");
  });

  test("strip map", () => {
    const code = ".foo {color: red;}/*# sourceMappingURL=fixture.css.map */";
    expect(stripMap(code)).toBe(".foo {color: red;}");
  });

  test("map modifier", () => {
    const map = JSON.stringify({ sources: ["../a/b/../foo/bar.css", "../b/a/../bar/foo.css"] });
    const relativeSrc = JSON.stringify(mm(map).relative().toObject()?.sources);
    expect(relativeSrc).toBe(JSON.stringify(["../a/foo/bar.css", "../b/bar/foo.css"]));
    const wrongMap = mm("thisisnotjson").toString();
    expect(wrongMap).toBeUndefined();
  });
});
