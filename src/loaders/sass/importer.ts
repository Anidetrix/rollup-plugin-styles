import path from "path";
import { sync as resolveSync } from "resolve";
import resolveAsync from "../../utils/resolve-async";
import { getUrlOfPartial, isModule, normalizeUrl } from "../../utils/url";

const extensions = [".scss", ".sass", ".css"];

export const importer: sass.Importer = (url, importer, done): void => {
  const finalize = (id: string): void => done({ file: id.replace(/\.css$/i, "") });
  const next = (): void => done(null);

  if (!isModule(url)) return next();
  const moduleUrl = normalizeUrl(url);
  const partialUrl = getUrlOfPartial(moduleUrl);
  const options = { caller: "Sass importer", basedirs: [path.dirname(importer)], extensions };
  // Give precedence to importing a partial
  resolveAsync([partialUrl, moduleUrl], options).then(finalize).catch(next);
};

const finalize = (id: string): sass.Data => ({ file: id.replace(/\.css$/i, "") });
export const importerSync: sass.Importer = (url, importer): sass.Data => {
  if (!isModule(url)) return null;
  const moduleUrl = normalizeUrl(url);
  const partialUrl = getUrlOfPartial(moduleUrl);
  const options = { basedir: path.dirname(importer), extensions };

  // Give precedence to importing a partial
  try {
    try {
      return finalize(resolveSync(partialUrl, options));
    } catch {
      return finalize(resolveSync(moduleUrl, options));
    }
  } catch {
    return null;
  }
};
