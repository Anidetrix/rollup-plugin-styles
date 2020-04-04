import { makeLegalIdentifier } from "@rollup/pluginutils";

import path from "path";
import postcss from "postcss";
import modulesValues from "postcss-modules-values";
import localByDefault from "postcss-modules-local-by-default";
import extractImports from "postcss-modules-extract-imports";
import modulesScope from "postcss-modules-scope";

import { ModulesOptions } from "../../types";
import { humanlizePath } from "../../utils/path-utils";
import hasher from "../../utils/hash";

const hashRe = /\[hash(?::(\d+))?]/;

const defaultGenerateScopedName = (placeholder = "[dir]_[name]_[local]__[hash:8]") => (
  name: string,
  filename: string,
  css: string,
): string => {
  const hash = hasher(`${humanlizePath(filename)};${name};${css}`);
  const match = hashRe.exec(placeholder);
  const hashLen = match && Number.parseInt(match[1]);
  return makeLegalIdentifier(
    placeholder
      .replace("[dir]", path.basename(path.dirname(filename)))
      .replace("[name]", path.basename(filename, path.extname(filename)))
      .replace("[local]", name)
      .replace(hashRe, hashLen ? hash.slice(0, hashLen) : hash),
  );
};

export default (options: ModulesOptions): postcss.Transformer[] => {
  const opts = {
    mode: "local" as const,
    ...options,
    generateScopedName:
      typeof options.generateScopedName === "function"
        ? options.generateScopedName
        : defaultGenerateScopedName(options.generateScopedName),
  };

  return [
    modulesValues(),
    localByDefault({ mode: opts.mode }),
    extractImports({ failOnWrongOrder: opts.failOnWrongOrder }),
    modulesScope({
      exportGlobals: opts.exportGlobals,
      generateScopedName: opts.generateScopedName,
    }),
  ];
};
