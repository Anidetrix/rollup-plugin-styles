import path from "path";

import { Loader, StylusLoaderOptions } from "../types";
import { mm } from "../utils/sourcemap";
import loadModule from "../utils/load-module";
import { normalizePath } from "../utils/path";

const loader: Loader<StylusLoaderOptions> = {
  name: "stylus",
  test: /\.(styl|stylus)$/i,
  async process({ code, map }) {
    const stylus = await loadModule("stylus");
    if (!stylus)
      throw new Error("You need to install `stylus` package in order to process Stylus files");

    const style = stylus(code, { ...this.options })
      .set("filename", this.id)
      .set("sourcemap", { comment: false, basePath: path.dirname(this.id) });

    const render = async (): Promise<string> =>
      new Promise((resolve, reject) => {
        style.render((err, css) => (err ? reject(err) : resolve(css)));
      });

    code = await render();

    const deps = style.deps();
    for (const dep of deps) this.deps.add(normalizePath(dep));

    map =
      mm(style.sourcemap)
        .modify(map => {
          // We have to manually modify the sourcesContent field
          // since stylus compiler doesn't support it yet
          if (!map.sourcesContent) map.sourcesContent = [code];
        })
        .toString() ?? map;

    return { code, map };
  },
};

export default loader;
