import fs from "fs-extra";
import resolveAsync from "../../utils/resolve-async";
import { getUrlOfPartial, normalizeUrl } from "../../utils/url";

const getStylesFileManager = (less: less.Less): less.FileManager =>
  new (class extends less.AbstractFileManager implements less.FileManager {
    supports(): boolean {
      return true;
    }

    async loadFile(filename: string, basedir: string): Promise<less.File> {
      const options = { basedir, extensions: [".less", ".css"] };

      const url = normalizeUrl(filename);
      const partialUrl = getUrlOfPartial(url);

      // Give precedence to importing a partial
      let id: string;
      try {
        id = await resolveAsync(partialUrl, options);
      } catch {
        id = await resolveAsync(url, options);
      }

      return { filename: id, contents: await fs.readFile(id, "utf8") };
    }
  })();

const importer: less.Plugin = {
  install(less, pluginManager) {
    pluginManager.addFileManager(getStylesFileManager(less));
  },
};

export default importer;
