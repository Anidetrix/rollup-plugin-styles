import { Loader, SASSLoaderOptions } from "../../types";
import loadModule from "../../utils/load-module";
import { normalizePath } from "../../utils/path";

import { loadSass } from "./load";
import importer from "./importer";

const loader: Loader<SASSLoaderOptions> = {
  name: "sass",
  test: /\.(sass|scss)$/i,
  async process({ code, map }) {
    const { options } = this;

    const [sass, type] = await loadSass(options.impl);

    // `fibers` doesn't work in testing
    const useFibers = options.fibers ?? (type === "sass" && process.env.NODE_ENV !== "test");
    const fiber = useFibers ? await loadModule("fibers") : undefined;

    const render = async (options: sass.Options): Promise<sass.Result> =>
      new Promise((resolve, reject) => {
        sass.render(options, (err, css) => (err ? reject(err) : resolve(css)));
      });

    // Remove non-Sass options
    delete options.fibers;
    delete options.impl;

    // node-sass won't produce source maps if the `data`
    // option is used and `sourceMap` option is not a string.
    //
    // In case it is a string, `sourceMap` option
    // should be a path where the source map is written.
    //
    // But since we're using the `data` option,
    // the source map will not actually be written, but
    // all paths in sourcemap's sources will be relative to that path.
    const res = await render({
      ...options,
      file: this.id,
      data: (options.data ?? "") + code,
      indentedSyntax: /\.sass$/i.test(this.id),
      sourceMap: this.id,
      omitSourceMapUrl: true,
      sourceMapContents: true,
      importer: [importer].concat(options.importer ?? []),
      fiber,
    });

    const deps = res.stats.includedFiles;
    for (const dep of deps) this.deps.add(normalizePath(dep));

    return {
      code: Buffer.from(res.css).toString(),
      map: res.map ? Buffer.from(res.map).toString() : map,
    };
  },
};

export default loader;
