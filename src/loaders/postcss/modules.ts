import { makeLegalIdentifier } from "@rollup/pluginutils";

import path from "path";
import { Plugin as PostCSSPlugin } from "postcss";
import modulesValues from "postcss-modules-values";
import localByDefault from "postcss-modules-local-by-default";
import extractImports from "postcss-modules-extract-imports";
import modulesScope, { ScopeOptions } from "postcss-modules-scope";

import { ModulesOptions } from "../../types";
import { humanlizePath } from "../../utils/path-utils";
import hash from "../../utils/hash";

const hashRe = /\[hash(?::(\d+))?]/;

type HashData = { name: string; filename: string; css: string };
/**
 * @param {object} data Hash Data
 * @returns {string} Hash
 */
function getHash({ name, filename, css }: HashData): string {
  return hash(`${humanlizePath(filename)};${name};${css}`);
}

/**
 * @param {string|undefined} placeholder string with placeholders
 * @returns {Function} function for generating scoped name
 */
function getGenerator(placeholder?: string): NonNullable<ScopeOptions["generateScopedName"]> {
  if (placeholder) {
    return (name: string, filename: string, css: string): string => {
      const hash = getHash({ name, filename, css });
      const match = hashRe.exec(placeholder);
      const hashLen = match && parseInt(match[1]);
      return makeLegalIdentifier(
        placeholder
          .replace("[name]", path.basename(filename, path.extname(filename)))
          .replace("[local]", name)
          .replace(hashRe, hashLen ? hash.slice(0, hashLen) : hash),
      );
    };
  }

  return (name: string, filename: string, css: string): string => {
    const i = css.indexOf(`.${name}`);
    const lineNumber = css.slice(0, i).split(/[\n\r]/).length;
    const hash = getHash({ name, filename, css }).slice(0, 8);
    return makeLegalIdentifier(`${name}_${hash}_${lineNumber}`);
  };
}

export default (options: ModulesOptions): PostCSSPlugin<unknown>[] => {
  const opts = {
    mode: "local" as "local",
    ...options,
    generateScopedName:
      typeof options.generateScopedName === "function"
        ? options.generateScopedName
        : getGenerator(options.generateScopedName),
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
