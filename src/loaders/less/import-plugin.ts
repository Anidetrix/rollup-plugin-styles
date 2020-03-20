import fs from "fs-extra";
import less, { LoadedFile, Plugin } from "less";
import resolveAsync from "../../utils/resolve-async";
import { moduleRe, getUrlOfPartial } from "../../utils/resolve-utils";

class StylesFileManager extends less.FileManager {
  supports(): boolean {
    return true;
  }

  supportsSync(): boolean {
    return false;
  }

  async loadFile(filename: string, currentDirectory: string): Promise<LoadedFile> {
    const options = { basedir: currentDirectory, extensions: [".less", ".css"] };

    if (!moduleRe.test(filename)) {
      let resolved: string;
      try {
        // Give precedence to importing a partial
        try {
          resolved = await resolveAsync(getUrlOfPartial(filename), options);
        } catch (error) {
          resolved = await resolveAsync(filename, options);
        }
      } catch (error) {
        // Give precedence to importing a partial
        try {
          resolved = await resolveAsync(`./${getUrlOfPartial(filename)}`, options);
        } catch (error) {
          resolved = await resolveAsync(`./${filename}`, options);
        }
      }
      return { filename: resolved, contents: await fs.readFile(resolved, "utf8") };
    }

    const moduleUrl = filename.slice(1);
    const partialUrl = getUrlOfPartial(moduleUrl);

    // Give precedence to importing a partial
    let resolved: string;
    try {
      resolved = await resolveAsync(partialUrl, options);
    } catch (error) {
      resolved = await resolveAsync(moduleUrl, options);
    }

    return { filename: resolved, contents: await fs.readFile(resolved, "utf8") };
  }
}

const importPlugin: Plugin = {
  install(_, pluginManager) {
    pluginManager.addFileManager(new StylesFileManager());
  },
};

export default importPlugin;
