import resolveAsync from "./resolve-async";

export interface ModuleImportMap {
  sass: sass.Sass;
  "node-sass": sass.Sass;
  fibers: fibers.Fiber;
  less: less.Less;
  stylus: stylus.Stylus;
  [x: string]: unknown;
}

export default async <T extends keyof ModuleImportMap>(
  moduleId: T,
  basedir = process.cwd(),
): Promise<ModuleImportMap[T] | undefined> => {
  if (typeof moduleId !== "string") return;

  try {
    return require(moduleId);
  } catch {
    /* noop */
  }

  try {
    return require(await resolveAsync(moduleId, { basedir }));
  } catch {
    /* noop */
  }

  try {
    return require(await resolveAsync(`./${moduleId}`, { basedir }));
  } catch {
    return;
  }
};
