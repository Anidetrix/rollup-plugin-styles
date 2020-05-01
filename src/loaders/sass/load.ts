import { Sass } from "sass";

import { SASSLoaderOptions } from "../../types";
import loadModule from "../../utils/load-module";

type SassImplementation = NonNullable<SASSLoaderOptions["impl"]>;
const allSassIDs = ["node-sass", "sass"] as const;

export async function loadSass(impl?: SassImplementation): Promise<[Sass, SassImplementation]> {
  const sassIDs = impl ? ([impl] as const) : allSassIDs;

  // Loading one of the supported modules
  for await (const id of sassIDs) {
    const module = await loadModule(id);
    if (module) return [module, id];
    if (impl) throw new Error(`Could not load \`${impl}\` Sass implementation`);
  }

  throw new Error(
    [
      "You need to install one of the following packages:",
      allSassIDs.map(id => `\`${id}\``).join(", "),
      "in order to process Sass files",
    ].join("\n"),
  );
}
