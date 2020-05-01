/* eslint-disable import/no-duplicates */
declare module "postcss-modules-values" {
  import { Plugin } from "postcss";

  export interface ValuesOptions {
    createImportedName?: (name: string, path: string) => string;
  }

  export default function (options?: ValuesOptions): Plugin<unknown>;
}

declare module "postcss-modules-local-by-default" {
  import { Plugin } from "postcss";

  export interface LocalByDefaultOptions {
    mode?: "local" | "global" | "pure";
    rewriteUrl?: (global: boolean, value: string) => string;
  }

  export default function (options?: LocalByDefaultOptions): Plugin<unknown>;
}

declare module "postcss-modules-extract-imports" {
  import { Plugin } from "postcss";

  export interface ExtractImportsOptions {
    failOnWrongOrder?: boolean;
    createImportedName?: (name: string, file: string) => string;
  }

  export default function (options?: ExtractImportsOptions): Plugin<unknown>;
}

declare module "postcss-modules-scope" {
  import { Plugin } from "postcss";

  export interface ScopeOptions {
    exportGlobals?: boolean;
    generateScopedName?: (name: string, file: string, css: string) => string;
    generateExportEntry?: (name: string, scopedName: string, file: string, css: string) => string;
  }

  export default function (options?: ScopeOptions): Plugin<unknown>;
}
