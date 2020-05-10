import path from "path";

import { LESSLoaderOptions, Loader } from "../../types";
import loadModule from "../../utils/load-module";
import { normalizePath } from "../../utils/path";

import importer from "./importer";

const loader: Loader<LESSLoaderOptions> = {
  name: "less",
  test: /\.less$/i,
  async process({ code, map }) {
    const less = await loadModule("less");
    if (!less) throw new Error("You need to install `less` package in order to process Less files");

    const res = await less.render(code, {
      ...this.options,
      plugins: [importer].concat(this.options.plugins ?? []),
      filename: this.id,
      sourceMap: { outputSourceFiles: true, sourceMapBasepath: path.dirname(this.id) },
    });

    const deps = res.imports;
    for (const dep of deps) this.deps.add(normalizePath(dep));

    return { code: res.css, map: res.map ?? map };
  },
};

export default loader;
