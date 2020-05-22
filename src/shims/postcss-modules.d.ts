/* eslint-disable import/no-duplicates */
declare module "postcss-modules-values" {
  import { Plugin } from "postcss";
  export default function (options?: unknown): Plugin<unknown>;
}

declare module "postcss-modules-local-by-default" {
  import { Plugin } from "postcss";
  export type Options = { mode?: "local" | "global" | "pure" };
  export default function (options?: Options): Plugin<Options>;
}

declare module "postcss-modules-extract-imports" {
  import { Plugin } from "postcss";
  export type Options = { failOnWrongOrder?: boolean };
  export default function (options?: Options): Plugin<Options>;
}

declare module "postcss-modules-scope" {
  import { Plugin } from "postcss";
  export type Options = {
    exportGlobals?: boolean;
    generateScopedName?: (name: string, file: string, css: string) => string;
  };
  export default function (options?: Options): Plugin<Options>;
}
