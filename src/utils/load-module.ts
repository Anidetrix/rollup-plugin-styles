import { Sass } from "sass";
import { Sass as NodeSass } from "node-sass";
import { FiberConstructor } from "fibers";
import { Less } from "less";
import { Stylus } from "stylus";

import resolveAsync from "./resolve-async";

export type ModuleImportMap = {
  sass: Sass;
  "node-sass": NodeSass;
  fibers: FiberConstructor;
  less: Less;
  stylus: Stylus;
  [k: string]: unknown;
};

export default async <T extends keyof ModuleImportMap>(
  moduleId: T,
  basedir = process.cwd(),
): Promise<ModuleImportMap[T] | undefined> => {
  if (typeof moduleId !== "string") return;

  try {
    return require(moduleId);
  } catch (error) {
    /* noop */
  }

  try {
    return require(await resolveAsync(moduleId, { basedir }));
  } catch (error) {
    /* noop */
  }

  try {
    return require(await resolveAsync(`./${moduleId}`, { basedir }));
  } catch (error) {
    return;
  }
};
