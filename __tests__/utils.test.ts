import { Payload } from "../src/types";
import Loaders from "../src/loaders";
import postcss from "postcss";
import postcssNoop from "../src/loaders/postcss/noop";
import { loadSass } from "../src/loaders/sass/load";
import { ensurePCSSOption } from "../src/utils/options";
import { mm, getMap, stripMap } from "../src/utils/sourcemap";
import { humanlizePath } from "../src/utils/path";

import { fixture } from "./helpers";

jest.mock("../src/utils/load-module", () => jest.fn());
import loadModuleMock from "../src/utils/load-module";

test("noop", async () => {
  const { css } = await postcss(postcssNoop).process(".foo{color:red}", { from: "simple.css" });
  expect(css).toBe(".foo{color:red}");
});

describe("load-module", () => {
  const loadModule = jest.requireActual("../src/utils/load-module")
    .default as typeof loadModuleMock;

  test("wrong path", async () => {
    await expect(loadModule("totallyWRONGPATH/here")).resolves.toBeUndefined();
  });

  test("correct cwd path", async () => {
    await expect(loadModule(humanlizePath(fixture("utils/fixture")))).resolves.toBe(
      "this is fixture",
    );
  });

  test("correct absolute path", async () => {
    await expect(loadModule(fixture("utils/fixture"))).resolves.toBe("this is fixture");
  });

  test("correct path with custom basepath", async () => {
    await expect(loadModule("fixture", fixture("utils"))).resolves.toBe("this is fixture");
  });
});

describe("less", () => {
  test("not found", async () => {
    const loaders = new Loaders({ use: ["less"], loaders: [], extensions: [""] });
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loaders.process({ code: "" }, { id: "file.less" } as any),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("stylus", () => {
  test("not found", async () => {
    const loaders = new Loaders({ use: ["stylus"], loaders: [], extensions: [""] });
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loaders.process({ code: "" }, { id: "file.styl" } as any),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("load-sass", () => {
  test("wrong implementation", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(loadSass("swass" as any)).rejects.toThrowErrorMatchingSnapshot();
  });

  test("not found", async () => {
    await expect(loadSass()).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("loaders", () => {
  test("unlisting", () => {
    const testLoader = {
      name: "test",
      alwaysProcess: true,
      process: (): Payload => ({ code: "" }),
    };
    const loaders = new Loaders({ use: ["test"], loaders: [testLoader], extensions: [""] });
    expect(loaders.getLoader("test")).toBe(testLoader);
    loaders.unlistLoader("test");
    expect(loaders.getLoader("test")).toBeUndefined();
  });
});

describe("option-utils", () => {
  test("wrong postcss option", () => {
    expect(() => ensurePCSSOption("pumpinizer", "plugin")).toThrowErrorMatchingSnapshot();
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
    await expect(getMap(code)).rejects.toThrowErrorMatchingSnapshot();
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
