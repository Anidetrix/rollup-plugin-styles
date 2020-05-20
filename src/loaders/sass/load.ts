import loadModule from "../../utils/load-module";

const allSassIDs = ["node-sass", "sass"] as const;

const idFmt = allSassIDs
  .map((id, i, arr) => {
    const newId = `\`${id}\``;
    if (i === arr.length - 2) return newId;
    if (i === arr.length - 1) return `or ${newId}`;
    return `${newId},`;
  })
  .join(" ");

export async function loadSass(impl?: string): Promise<[sass.Sass, string]> {
  // Loading provided implementation
  if (impl) {
    const provided = await loadModule(impl);
    if (provided) return [provided as sass.Sass, impl];
    throw new Error(`Could not load \`${impl}\` Sass implementation`);
  }

  // Loading one of the supported modules
  for await (const id of allSassIDs) {
    const sass = await loadModule(id);
    if (sass) return [sass, id];
  }

  throw new Error(`You need to install ${idFmt} package in order to process Sass files`);
}
