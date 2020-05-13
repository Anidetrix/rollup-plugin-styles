import { Sass } from "sass";

import { SASSLoaderOptions } from "../../types";
import loadModule from "../../utils/load-module";

type SassImplementation = NonNullable<SASSLoaderOptions["impl"]>;
const allSassIDs = ["node-sass", "sass"] as const;

const idFmt = allSassIDs
  .map((id, i, arr) => {
    const newId = `\`${id}\``;
    if (i === arr.length - 2) return newId;
    if (i === arr.length - 1) return `or ${newId}`;
    return `${newId},`;
  })
  .join(" ");

export async function loadSass(impl?: SassImplementation): Promise<[Sass, SassImplementation]> {
  const sassIDs = impl ? ([impl] as const) : allSassIDs;

  // Loading one of the supported modules
  for await (const id of sassIDs) {
    const module = await loadModule(id);
    if (module) return [module, id];
    if (impl) throw new Error(`Could not load \`${impl}\` Sass implementation`);
  }

  throw new Error(`You need to install ${idFmt} package in order to process Sass files`);
}
