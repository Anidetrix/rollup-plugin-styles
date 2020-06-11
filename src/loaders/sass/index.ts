import loadModule from "../../utils/load-module";
import { normalizePath } from "../../utils/path";
import { Loader } from "../types";
import loadSass from "./load";
import { importer, importerSync } from "./importer";

/** Options for Sass loader */
// https://github.com/microsoft/TypeScript/issues/37901
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export interface SASSLoaderOptions extends Record<string, unknown>, sass.PublicOptions {
  /** Force Sass implementation */
  impl?: string;
  /** Forcefully enable/disable `fibers` */
  fibers?: boolean;
  /** Forcefully enable/disable sync mode */
  sync?: boolean;
}

const loader: Loader<SASSLoaderOptions> = {
  name: "sass",
  test: /\.(sass|scss)$/i,
  async process({ code, map }) {
    const options = { ...this.options };
    const [sass, type] = loadSass(options.impl);
    const useFibers = options.fibers ?? type === "sass";
    const fiber = useFibers ? (loadModule("fibers") as fibers.Fiber) : undefined;
    const sync = options.sync ?? (type !== "node-sass" && !fiber);
    const importers = [sync ? importerSync : importer];

    if (options.data) code = options.data + code;

    if (options.importer)
      Array.isArray(options.importer)
        ? importers.push(...options.importer)
        : importers.push(options.importer);

    const render = async (options: sass.Options): Promise<sass.Result> =>
      new Promise((resolve, reject) => {
        if (sync) resolve(sass.renderSync(options));
        else sass.render(options, (err, css) => (err ? reject(err) : resolve(css)));
      });

    // Remove non-Sass options
    delete options.impl;
    delete options.fibers;
    delete options.sync;

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
      data: code,
      indentedSyntax: /\.sass$/i.test(this.id),
      sourceMap: this.id,
      omitSourceMapUrl: true,
      sourceMapContents: true,
      importer: importers,
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
