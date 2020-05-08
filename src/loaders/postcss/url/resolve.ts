import fs from "fs-extra";

import resolveAsync from "../../../utils/resolve-async";

/** File resolved by URL resolver */
export type ResolvedFile = { from: string; source: Uint8Array };

/** URL resolver */
export type Resolve = (url: string, basedir: string) => Promise<ResolvedFile>;

const resolve: Resolve = async (url, basedir) => {
  const options = { basedir };
  let from: string;
  try {
    from = await resolveAsync(url, options);
  } catch (error) {
    from = await resolveAsync(`./${url}`, options);
  }
  return { from, source: await fs.readFile(from) };
};

export default resolve;
