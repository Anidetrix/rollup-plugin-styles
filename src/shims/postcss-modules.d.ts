/* eslint-disable import/no-duplicates */
declare module "postcss-modules-values" {
  import { Plugin } from "postcss";
  export default function (options?: {}): Plugin<{}>;
}

declare module "postcss-modules-local-by-default" {
  import { Plugin } from "postcss";

  export interface LocalByDefaultOptions {
    mode?: "local" | "global" | "pure";
  }

  export default function (options?: LocalByDefaultOptions): Plugin<LocalByDefaultOptions>;
}

declare module "postcss-modules-extract-imports" {
  import { Plugin } from "postcss";

  export interface ExtractImportsOptions {
    failOnWrongOrder?: boolean;
  }

  export default function (options?: ExtractImportsOptions): Plugin<ExtractImportsOptions>;
}

declare module "postcss-modules-scope" {
  import { Plugin } from "postcss";

  export interface ScopeOptions {
    exportGlobals?: boolean;
    generateScopedName?: (name: string, file: string, css: string) => string;
  }

  export default function (options?: ScopeOptions): Plugin<ScopeOptions>;
}
