import PQueue from "p-queue";
import { Options as SASSOptions, Result as SASSResult, Sass } from "sass";
import { FiberConstructor } from "fibers";

import { Loader, Payload, SASSLoaderOptions } from "../../types";
import loadModule from "../../utils/load-module";

import defaultImporter from "./default-importer";

// This queue makes sure node-sass leaves one thread available for executing fs tasks
// See: https://github.com/sass/node-sass/issues/857
const threadPoolSize = parseInt(process.env.UV_THREADPOOL_SIZE || "4");
const workQueue = new PQueue({ concurrency: threadPoolSize - 1 });

type AllowedSassID = "sass" | "node-sass";
const possibleSassIDs: AllowedSassID[] = ["node-sass", "sass"];

/**
 * Loads Sass module or throws an error
 * @returns A tuple in format [`loaded sass module`, `id`],
 */
async function loadSassOrThrow(): Promise<[Sass, AllowedSassID]> {
  // Loading one of the supported modules
  for (const id of possibleSassIDs) {
    const module = await loadModule(id);
    if (module) return [module, id];
  }

  // Throwing exception if module can't be loaded
  throw new Error(
    [
      "You need to install one of the following packages:",
      possibleSassIDs.map(id => `\`${id}\``).join(", "),
      "in order to process Sass files",
    ].join("\n"),
  );
}

const loader: Loader<SASSLoaderOptions> = {
  name: "sass",
  test: /\.(sass|scss)$/i,
  async process({ code, map }) {
    const [sass, sassType] = await loadSassOrThrow();

    const render = (options: SASSOptions): Promise<SASSResult> =>
      new Promise((resolve, reject) => {
        sass.render(options, (err, css) => (err ? reject(err) : resolve(css)));
      });

    let fiber: FiberConstructor | undefined;
    // Disable `fibers` for testing, it doesn't work
    if (sassType == "sass" && !process.env.STYLES_TEST) fiber = await loadModule("fibers");

    return workQueue.add<Payload>(
      async (): Promise<Payload> => {
        // node-sass won't produce source maps if the data option is used and `sourceMap` option is not a string.
        // In case it is a string, `sourceMap` option should be a path where the source map is written.
        // But since we're using the data option, the source map will not actually be written, but
        // all paths in sourcemap's sources will be relative to that path.
        const res = await render({
          ...this.options,
          file: this.id,
          data: (this.options.data || "") + code,
          indentedSyntax: /\.sass$/i.test(this.id),
          sourceMap: Boolean(this.sourceMap) && this.id,
          omitSourceMapUrl: true,
          sourceMapContents: true,
          importer: [defaultImporter].concat(this.options.importer || []),
          fiber,
        });

        const deps = res.stats.includedFiles;
        for (const dep of deps) this.dependencies.add(dep);

        return { code: res.css.toString(), map: (res.map && res.map.toString()) || map };
      },
    );
  },
};

export default loader;
