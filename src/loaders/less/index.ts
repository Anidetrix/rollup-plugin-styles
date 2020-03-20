import path from "path";

import { Loader } from "../../types";
import loadModule from "../../utils/load-module";

import importPlugin from "./import-plugin";

const loader: Loader = {
  name: "less",
  test: /\.less$/i,
  async process({ code, map }) {
    const less = await loadModule("less");
    if (!less) this.error("You need to install `less` package in order to process Less files");

    const res = await less.render(code, {
      ...this.options,
      plugins: [importPlugin].concat(
        Array.isArray(this.options.plugins) ? this.options.plugins : [],
      ),
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
