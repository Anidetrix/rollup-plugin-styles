import resolver, { sync, AsyncOpts, SyncOpts } from "resolve";
import { legacy as resolveLegacy, resolve as resolveExports } from "resolve.exports";
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

interface PackageFilterResolveOpts {
  fields?: string[];
  conditions?: string[];
}

export function createPackageFilter({
  fields = ["style", "module", "main"],
  conditions = ["style"],
}: PackageFilterResolveOpts = {}): (pkg: Package, pkgfile: string) => Package {
  return (pkg: Package) => {
    try {
      pkg.main = resolveLegacy(pkg, { fields }) as string;
    } catch {
      /* ignore packageFilter resolution errors */
    }
    try {
      pkg.main = resolveExports(pkg, ".", { conditions, unsafe: true }) as string;
    } catch {
      /* ignore packageFilter resolution errors */
    }
    return pkg;
  };
}

const defaultOpts: ResolveDefaultOpts = {
  caller: "Resolver",
  basedirs: [__dirname],
  extensions: [".mjs", ".js", ".json"],
  preserveSymlinks: true,
  packageFilter: createPackageFilter(),
};

const resolverAsync = async (id: string, options: AsyncOpts = {}): Promise<string | undefined> =>
  new Promise(resolve => resolver(id, options, (_, res) => resolve(res)));

export async function resolveAsync(ids: string[], userOpts: ResolveOpts): Promise<string> {
  const options = { ...defaultOpts, ...userOpts };
  for await (const basedir of options.basedirs) {
    const opts = { ...options, basedir, basedirs: undefined, caller: undefined };
    for await (const id of ids) {
      const resolved = await resolverAsync(id, opts);
      if (resolved) return resolved;
    }
  }

  throw new Error(`${options.caller} could not resolve ${arrayFmt(ids)}`);
}

const resolverSync = (id: string, options: SyncOpts = {}): string | undefined => {
  try {
    return sync(id, options);
  } catch {
    return;
  }
};

export function resolveSync(ids: string[], userOpts: ResolveOpts): string {
  const options = { ...defaultOpts, ...userOpts };
  for (const basedir of options.basedirs) {
    const opts = { ...options, basedir, basedirs: undefined, caller: undefined };
    for (const id of ids) {
      const resolved = resolverSync(id, opts);
      if (resolved) return resolved;
    }
  }

  throw new Error(`${options.caller} could not resolve ${arrayFmt(ids)}`);
}
