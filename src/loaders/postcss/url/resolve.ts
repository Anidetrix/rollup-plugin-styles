import fs from "fs-extra";

import resolveAsync from "../../../utils/resolve-async";

/** File resolved by URL resolver */
export interface UrlFile {
  /** Absolute path to file */
  from: string;
  /** File source */
  source: Uint8Array;
}

/** URL resolver */
export type UrlResolve = (url: string, basedir: string) => Promise<UrlFile>;

const resolve: UrlResolve = async (url, basedir) => {
  const options = { basedir };
  let from: string;
  try {
    from = await resolveAsync(url, options);
  } catch {
    from = await resolveAsync(`./${url}`, options);
  }
  return { from, source: await fs.readFile(from) };
};

export default resolve;
