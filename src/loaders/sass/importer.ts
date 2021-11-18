import path from "path";
import { isAbsolutePath, isRelativePath } from "../../utils/path";
import { packageFilterBuilder, resolveAsync, ResolveOpts, resolveSync } from "../../utils/resolve";
import { getUrlOfPartial, hasModuleSpecifier, normalizeUrl } from "../../utils/url";

const extensions = [".scss", ".sass", ".css"];
const conditions = ["sass", "style"];

/**
 * The exact behavior of importers defined here differ slightly between dart-sass and node-sass:
 * https://github.com/sass/dart-sass/issues/574
 *
 * In short, dart-sass specifies that the *correct* behavior is to only call importers when a
 * stylesheet fails to resolve via relative path. Since these importers below are implementation-
 * agnostic, the first attempt to resolve a file by a relative is unneeded in dart-sass and can be
 * removed once support for node-sass is fully deprecated.
 */
function importerImpl<T extends (ids: string[], userOpts: ResolveOpts) => unknown>(
  url: string,
  importer: string,
  resolve: T,
): ReturnType<T> {
  const candidates: string[] = [];
  if (hasModuleSpecifier(url)) {
    const moduleUrl = normalizeUrl(url);
    // Give precedence to importing a partial
    candidates.push(getUrlOfPartial(moduleUrl), moduleUrl);
  } else {
    const relativeUrl = normalizeUrl(url);
    candidates.push(getUrlOfPartial(relativeUrl), relativeUrl);

    // fall back to module imports
    if (!isAbsolutePath(url) && !isRelativePath(url)) {
      const moduleUrl = normalizeUrl(`~${url}`);
      candidates.push(getUrlOfPartial(moduleUrl), moduleUrl);
    }
  }
  const options = {
    caller: "Sass importer",
    basedirs: [path.dirname(importer)],
    extensions,
    packageFilter: packageFilterBuilder({ conditions }),
  };
  return resolve(candidates, options) as ReturnType<T>;
}

const finalize = (id: string): sass.Data => ({ file: id.replace(/\.css$/i, "") });

export const importer: sass.Importer = (url, importer, done): void => {
  void importerImpl(url, importer, resolveAsync)
    .then(id => done(finalize(id)))
    .catch(() => done(null));
};

export const importerSync: sass.Importer = (url, importer): sass.Data => {
  try {
    return finalize(importerImpl(url, importer, resolveSync));
  } catch {
    return null;
  }
};
