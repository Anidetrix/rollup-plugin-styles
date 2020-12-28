import resolver, { AsyncOpts } from "resolve";
import arrayFmt from "./array-fmt";

export interface ResolveOpts {
  /** name of the caller for error message (default to `Resolver`) */
  caller?: string;
  /** directories to begin resolving from (defaults to `[__dirname]`) */
  basedirs?: string[];
  /** array of file extensions to search in order (defaults to `[".mjs", ".js", ".json"]`) */
  extensions?: string | ReadonlyArray<string>;
  /** don't resolve `basedirs` to real path before resolving. (defaults to `true`) */
  preserveSymlinks?: boolean;
  /** transform the parsed `package.json` contents before looking at the "main" field */
  packageFilter?: (pkg: Package, pkgfile: string) => Package;
}

interface ResolveDefaultOpts {
  caller: string;
  basedirs: ReadonlyArray<string>;
  extensions: ReadonlyArray<string>;
  preserveSymlinks: boolean;
  packageFilter: (pkg: Package, pkgfile: string) => Package;
}

interface Package {
  main: string;
  module?: string;
  style?: string;
}

const defaultOpts: ResolveDefaultOpts = {
  caller: "Resolver",
  basedirs: [__dirname],
  extensions: [".mjs", ".js", ".json"],
  preserveSymlinks: true,
  packageFilter(pkg) {
    if (pkg.module) pkg.main = pkg.module;
    if (pkg.style) pkg.main = pkg.style;
    return pkg;
  },
};

const resolveAsync = async (id: string, options: AsyncOpts = {}): Promise<string | undefined> =>
  new Promise(resolve => resolver(id, options, (_, res) => resolve(res)));

export default async function (ids: string[], userOpts: ResolveOpts): Promise<string> {
  const options = { ...defaultOpts, ...userOpts };
  for await (const basedir of options.basedirs) {
    const opts = { ...options, basedir, basedirs: undefined, caller: undefined };
    for await (const id of ids) {
      const resolved = await resolveAsync(id, opts);
      if (resolved) return resolved;
    }
  }

  const idsFmt = arrayFmt(ids);
  throw new Error(`${options.caller} could not resolve ${idsFmt}`);
}
