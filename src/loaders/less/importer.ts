import fs from "fs-extra";
import { FileManagerInterface, Less, LoadedFile, Plugin } from "less";
import resolveAsync from "../../utils/resolve-async";
import { getUrlOfPartial, normalizeUrl } from "../../utils/url";

const getStylesFileManager = (less: Less): FileManagerInterface =>
  new (class extends less.AbstractFileManager implements FileManagerInterface {
    supports(): boolean {
      return true;
    }

    supportsSync(): boolean {
      return false;
    }

    async loadFile(filename: string, basedir: string): Promise<LoadedFile> {
      const options = { basedir, extensions: [".less", ".css"] };

      const url = normalizeUrl(filename);
      const partialUrl = getUrlOfPartial(url);

      // Give precedence to importing a partial
      let id: string;
      try {
        id = await resolveAsync(partialUrl, options);
      } catch (error) {
        id = await resolveAsync(url, options);
      }

      return { filename: id, contents: await fs.readFile(id, "utf8") };
    }
  })();

const importer: Plugin = {
  install(less, pluginManager) {
    pluginManager.addFileManager(getStylesFileManager(less));
  },
};

export default importer;
