import path from "path";

import { Loader } from "../types";
import loadModule from "../utils/load-module";

const loader: Loader = {
  name: "less",
  test: /\.less$/i,
  async process({ code, map }) {
    const less = await loadModule("less");
    if (!less) this.error("You need to install `less` package in order to process Less files");

    const render = (code: string, options: Less.Options): Promise<Less.RenderOutput> =>
      new Promise((resolve, reject) =>
        less.render(code, options, (err, css) => (err ? reject(err) : resolve(css))),
      );

    const res = await render(code, {
      ...this.options,
      filename: this.id,
      sourceMap: this.sourceMap
        ? { outputSourceFiles: true, sourceMapBasepath: path.dirname(this.id) }
        : undefined,
    });

    const deps = res.imports;
    for (const dep of deps) this.dependencies.add(dep);

    return { code: res.css, map: res.map || map };
  },
};

export default loader;
