import postcss from "postcss";
import modulesValues from "postcss-modules-values";
import localByDefault, { LocalByDefaultOptions } from "postcss-modules-local-by-default";
import extractImports, { ExtractImportsOptions } from "postcss-modules-extract-imports";
import modulesScope, { ScopeOptions } from "postcss-modules-scope";

import generateScopedNameDefault from "./generate";

/** Options for [CSS Modules](https://github.com/css-modules/css-modules) */
export type ModulesOptions = {
  /**
   * Default mode for classes
   * @default "local"
   * */
  mode?: LocalByDefaultOptions["mode"];
  /** Fail on wrong order of composition */
  failOnWrongOrder?: ExtractImportsOptions["failOnWrongOrder"];
  /** Export global classes */
  exportGlobals?: ScopeOptions["exportGlobals"];
  /**
   * Placeholder or function for scoped name generation.
   * Allowed blocks for placeholder:
   * - `[dir]` - File's directory name
   * - `[name]` - File's name
   * - `[local]` - Selector's original name
   * - `[hash(:<num>)]` - Hash (with optional length)
   * @default "[name]_[local]__[hash:8]"
   * */
  generateScopedName?: string | ScopeOptions["generateScopedName"];
  /** Function for resulting replacements extraction */
  getReplacements?: (file: string, replacements: { [k: string]: string }, out?: string) => void;
};

export default (options: ModulesOptions): postcss.Transformer[] => {
  const opts = {
    mode: "local" as const,
    ...options,
    generateScopedName:
      typeof options.generateScopedName === "function"
        ? options.generateScopedName
        : generateScopedNameDefault(options.generateScopedName),
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
