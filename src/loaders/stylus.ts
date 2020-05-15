import path from "path";
import fs from "fs-extra";
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

    const basePath = normalizePath(path.dirname(this.id));

    const style = stylus(code, { ...this.options })
      .set("filename", this.id)
      .set("paths", [`${basePath}/node_modules`, basePath].concat(this.options.paths ?? []))
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
    if (style.sourcemap?.sources) {
      style.sourcemap.sourcesContent = await Promise.all(
        style.sourcemap.sources.map(async source => {
          try {
            const file = normalizePath(basePath, source);
            return await fs.readFile(file, "utf8");
          } catch {
            // eslint-disable-next-line unicorn/no-null
            return (null as unknown) as string;
          }
        }),
      );
    }

    map = mm(style.sourcemap).toString() ?? map;

    return { code, map };
  },
};

export default loader;
