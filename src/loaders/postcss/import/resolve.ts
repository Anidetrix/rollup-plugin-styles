import fs from "fs-extra";
import { parseUrl } from "query-string";
import { resolveAsync } from "../../../utils/resolve";

/** File resolved by `@import` resolver */
export interface ImportFile {
  /** Absolute path to file */
  from: string;
  /** File source */
  source: Uint8Array;
}

/** `@import` resolver */
export type ImportResolve = (
  url: string,
  basedir: string,
  extensions: string[],
) => Promise<ImportFile>;

const resolve: ImportResolve = async (inputUrl, basedir, extensions) => {
  const options = { caller: "@import resolver", basedirs: [basedir], extensions };
  const parseOptions = { parseFragmentIdentifier: true, sort: false as const, decode: false };
  const { url } = parseUrl(inputUrl, parseOptions);
  const from = await resolveAsync([url, `./${url}`], options);
  return { from, source: await fs.readFile(from) };
};

export default resolve;
