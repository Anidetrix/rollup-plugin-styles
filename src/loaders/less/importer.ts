import fs from "fs-extra";
import { resolveAsync } from "../../utils/resolve";
import { getUrlOfPartial, normalizeUrl } from "../../utils/url";

const extensions = [".less", ".css"];

const getStylesFileManager = (less: less.Less): less.FileManager =>
  new (class extends less.AbstractFileManager implements less.FileManager {
    supports(): boolean {
      return true;
    }

    async loadFile(filename: string, filedir: string, opts: less.Options): Promise<less.File> {
      const url = normalizeUrl(filename);
      const partialUrl = getUrlOfPartial(url);
      const options = { caller: "Less importer", basedirs: [filedir], extensions };
      if (opts.paths) options.basedirs.push(...opts.paths);
      // Give precedence to importing a partial
      const id = await resolveAsync([partialUrl, url], options);
      return { filename: id, contents: await fs.readFile(id, "utf8") };
    }
  })();

const importer: less.Plugin = {
  install(less, pluginManager) {
    pluginManager.addFileManager(getStylesFileManager(less));
  },
};

export default importer;
