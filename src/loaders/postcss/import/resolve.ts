import fs from "fs-extra";

import resolveAsync from "../../../utils/resolve-async";

/** File resolved by `@import` resolver */
export type ResolvedFile = { from: string; source: Uint8Array };

/** `@import` resolver */
export type Resolve = (url: string, basedir: string, extensions: string[]) => Promise<ResolvedFile>;

const resolve: Resolve = async (url, basedir, extensions) => {
  const options = { basedir, extensions };
  let from: string;
  try {
    from = await resolveAsync(url, options);
  } catch {
    from = await resolveAsync(`./${url}`, options);
  }
  return { from, source: await fs.readFile(from) };
};

export default resolve;
