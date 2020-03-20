import { Sass } from "sass";
import { Sass as NodeSass } from "node-sass";
import { FiberConstructor } from "fibers";
import { Less } from "less";
import { Stylus } from "stylus";

import resolveAsync from "./resolve-async";

/**
 * Interface for mapping module's name to it's type
 */
interface ModuleImportMap {
  sass: Sass;
  "node-sass": NodeSass;
  fibers: FiberConstructor;
  less: Less;
  stylus: Stylus;
  [k: string]: unknown;
}

export default async <K extends keyof ModuleImportMap>(
  moduleId: K,
  basedir = process.cwd(),
): Promise<ModuleImportMap[K] | undefined> => {
  if (typeof moduleId !== "string") return;

  // Trying to load module normally (relative to plugin directory)
  try {
    return require(moduleId);
  } catch (error) {
    // Ignore error
  }

  // Then, trying to load it relative to provided dir or CWD
  try {
    return require(await resolveAsync(moduleId, { basedir }));
  } catch (error) {
    // Ignore error
  }

  try {
    return require(await resolveAsync(`./${moduleId}`, { basedir }));
  } catch (error) {
    return;
  }
};
