import path from "path";
import { Importer as SASSImporter } from "sass";
import resolveAsync from "../../utils/resolve-async";
import { moduleRe, getUrlOfPartial } from "../../utils/resolve-utils";

const defaultImporter: SASSImporter = (url, importer, done) => {
  if (!moduleRe.test(url)) return done({ file: url });

  const moduleUrl = url.slice(1);
  const partialUrl = getUrlOfPartial(moduleUrl);

  const options = {
    basedir: path.dirname(importer),
    extensions: [".scss", ".sass", ".css"],
  };

  const finishImport = (id: string): void =>
    // Do not add `.css` extension in order to inline the file
    done({ file: id.replace(/\.css$/i, "") });

  const next = (): void =>
    // Pass responsibility back to other custom importers
    done(null);

  // Give precedence to importing a partial
  resolveAsync(partialUrl, options)
    .then(finishImport)
    .catch(error => {
      if (error.code === "MODULE_NOT_FOUND" || error.code === "ENOENT")
        resolveAsync(moduleUrl, options).then(finishImport).catch(next);
      else next();
    });
};

export default defaultImporter;
