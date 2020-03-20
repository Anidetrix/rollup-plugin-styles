import fs from "fs-extra";
import { LoadedFile, Plugin, FileManagerInterface, Less } from "less";
import resolveAsync from "../../utils/resolve-async";
import { moduleRe, getUrlOfPartial } from "../../utils/resolve-utils";

const getStylesFileManager = (): FileManagerInterface => {
  const less = require("less") as Less;
  return new (class extends less.AbstractFileManager implements FileManagerInterface {
    supports(): boolean {
      return true;
    }

    supportsSync(): boolean {
      return false;
    }

    async loadFile(filename: string, basedir: string): Promise<LoadedFile> {
      const options = { basedir, extensions: [".less", ".css"] };
      let id: string;

      if (!moduleRe.test(filename)) {
        try {
          // Give precedence to importing a partial
          try {
            id = await resolveAsync(getUrlOfPartial(filename), options);
          } catch (error) {
            id = await resolveAsync(filename, options);
          }
        } catch (error) {
          // Give precedence to importing a partial
          try {
            id = await resolveAsync(`./${getUrlOfPartial(filename)}`, options);
          } catch (error) {
            id = await resolveAsync(`./${filename}`, options);
          }
        }
        return { filename: id, contents: await fs.readFile(id, "utf8") };
      }

      const moduleUrl = filename.slice(1);
      const partialUrl = getUrlOfPartial(moduleUrl);

      // Give precedence to importing a partial
      try {
        id = await resolveAsync(partialUrl, options);
      } catch (error) {
        id = await resolveAsync(moduleUrl, options);
      }

      return { filename: id, contents: await fs.readFile(id, "utf8") };
    }
  })();
};

const importPlugin: Plugin = {
  install(_, pluginManager) {
    pluginManager.addFileManager(getStylesFileManager());
  },
};

export default importPlugin;
