import path from "path";
import fs from "fs-extra";
import { mm } from "../utils/sourcemap";
import loadModule from "../utils/load-module";
import { normalizePath } from "../utils/path";
import { Loader } from "./types";

/** Options for Stylus loader */
export interface StylusLoaderOptions extends Record<string, unknown>, stylus.PublicOptions {}

const loader: Loader<StylusLoaderOptions> = {
  name: "stylus",
  test: /\.(styl|stylus)$/i,
  async process({ code, map }) {
    const options = { ...this.options };
    const stylus = loadModule("stylus") as stylus.Stylus;
    if (!stylus)
      throw new Error("You need to install `stylus` package in order to process Stylus files");

    const basePath = normalizePath(path.dirname(this.id));

    const paths = [`${basePath}/node_modules`, basePath];
    if (options.paths) paths.push(...options.paths);

    const style = stylus(code, options)
      .set("filename", this.id)
      .set("paths", paths)
      .set("sourcemap", { comment: false, basePath });

    const render = async (): Promise<string> =>
      new Promise((resolve, reject) => {
        style.render((err, css) => (err ? reject(err) : resolve(css)));
      });

    code = await render();

    const deps = style.deps();
    for (const dep of deps) this.deps.add(normalizePath(dep));

    // We have to manually modify the `sourcesContent` field
    // since stylus compiler doesn't support it yet
    if (style.sourcemap?.sources && !style.sourcemap.sourcesContent) {
      style.sourcemap.sourcesContent = await Promise.all(
        style.sourcemap.sources.map(async source => {
          const file = normalizePath(basePath, source);
          const exists = await fs.pathExists(file);
          if (!exists) return (null as unknown) as string;
          return fs.readFile(file, "utf8");
        }),
      );
    }

    map = mm(style.sourcemap).toString() ?? map;

    return { code, map };
  },
};

export default loader;
