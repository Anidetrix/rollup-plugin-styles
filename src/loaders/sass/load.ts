import loadModule from "../../utils/load-module";
import arrayFmt from "../../utils/array-fmt";

const ids = ["sass", "node-sass"];
const idsFmt = arrayFmt(ids);
export default function (impl?: string): [sass.Sass, string] {
  // Loading provided implementation
  if (impl) {
    const provided = loadModule(impl);
    if (provided) return [provided as sass.Sass, impl];
    throw new Error(`Could not load \`${impl}\` Sass implementation`);
  }

  // Loading one of the supported modules
  for (const id of ids) {
    const sass = loadModule(id);
    if (sass) return [sass as sass.Sass, id];
  }

  throw new Error(`You need to install ${idsFmt} package in order to process Sass files`);
}
