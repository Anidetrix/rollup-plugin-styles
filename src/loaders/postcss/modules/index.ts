import postcss from "postcss";
import modulesValues from "postcss-modules-values";
import localByDefault, { Options as LocalByDefaultOptions } from "postcss-modules-local-by-default";
import extractImports, { Options as ExtractImportsOptions } from "postcss-modules-extract-imports";
import modulesScope, { Options as ScopeOptions } from "postcss-modules-scope";
import generateScopedNameDefault from "./generate";

/** Options for [CSS Modules](https://github.com/css-modules/css-modules) */
export interface ModulesOptions {
  /**
   * Default mode for classes
   * @default "local"
   */
  mode?: LocalByDefaultOptions["mode"];
  /** Fail on wrong order of composition */
  failOnWrongOrder?: ExtractImportsOptions["failOnWrongOrder"];
  /** Export global classes */
  exportGlobals?: ScopeOptions["exportGlobals"];
  /**
   * Placeholder or function for scoped name generation.
   * Allowed blocks for placeholder:
   * - `[dir]`: The directory name of the asset.
   * - `[name]`: The file name of the asset excluding any extension.
   * - `[local]`: The original value of the selector.
   * - `[hash(:<num>)]`: A hash based on the name and content of the asset (with optional length).
   * @default "[name]_[local]__[hash:8]"
   */
  generateScopedName?: string | ScopeOptions["generateScopedName"];
  /** Function for resulting replacements extraction */
  getReplacements?: (file: string, replacements: { [x: string]: string }, out?: string) => void;
}

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
