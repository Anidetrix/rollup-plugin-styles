import path from "path";

import { Loader, Payload } from "../types";
import loadModule from "../utils/load-module";

const loader: Loader = {
  name: "stylus",
  test: /\.(styl|stylus)$/i,
  async process(payload) {
    const stylus = loadModule("stylus");
    if (!stylus)
      this.error("You need to install `stylus` package in order to process Stylus files");

    const style = stylus(payload.code, { ...this.options })
      .set("filename", this.id)
      .set(
        "sourcemap",
        this.sourceMap ? { comment: false, basePath: path.dirname(this.id) } : undefined,
      );

    const render = (): Promise<string> =>
      new Promise((resolve, reject) => {
        style.render((err, css) => (err ? reject(err) : resolve(css)));
      });

    const code: Payload["code"] = await render();

    const deps = style.deps();
    for (const dep of deps) this.dependencies.add(dep);

    let map: Payload["map"];
    if (style.sourcemap) {
      // We have to manually modify the sourcesContent field since stylus compiler doesn't support it yet
      if (!style.sourcemap.sourcesContent) style.sourcemap.sourcesContent = [code];
      map = JSON.stringify(style.sourcemap);
    }

    return { code, map };
  },
};

export default loader;
