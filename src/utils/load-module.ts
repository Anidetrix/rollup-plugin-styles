import resolveAsync from "./resolve-async";

export interface ModuleImportMap extends Record<string, unknown> {
  sass: sass.Sass;
  "node-sass": sass.Sass;
  fibers: fibers.Fiber;
  less: less.Less;
  stylus: stylus.Stylus;
}

export default async <T extends keyof ModuleImportMap>(
  moduleId: T,
  basedir = process.cwd(),
): Promise<ModuleImportMap[T] | undefined> => {
  if (typeof moduleId !== "string") return;

  try {
    return require(moduleId) as ModuleImportMap[T];
  } catch {
    /* noop */
  }

  try {
    return require(await resolveAsync(moduleId, { basedir })) as ModuleImportMap[T];
  } catch {
    /* noop */
  }

  try {
    return require(await resolveAsync(`./${moduleId}`, { basedir })) as ModuleImportMap[T];
  } catch {
    return;
  }
};
