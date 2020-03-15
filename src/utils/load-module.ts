import importCwd from "import-cwd";
import { Sass } from "sass";
import { Sass as NodeSass } from "node-sass";
import { FiberConstructor } from "fibers";
import { Stylus } from "stylus";

/**
 * Interface for mapping module's name to it's type
 */
interface ModuleImportMap {
  sass: Sass;
  "node-sass": NodeSass;
  fibers: FiberConstructor;
  less: LessStatic;
  stylus: Stylus;
}

export default <K extends keyof ModuleImportMap>(moduleId: K): ModuleImportMap[K] | undefined => {
  // Trying to load module normally (relative to plugin directory)
  try {
    return require(moduleId);
  } catch (error) {
    // Ignore error
  }

  // Then, trying to load it relative to CWD
  return importCwd.silent(moduleId) as ModuleImportMap[K] | undefined;
};
