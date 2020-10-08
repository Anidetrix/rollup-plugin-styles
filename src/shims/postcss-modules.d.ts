/* eslint-disable import/no-duplicates */
declare module "postcss-modules-values" {
  import { PluginCreator } from "postcss";
  const plugin: PluginCreator<unknown>;
  export default plugin;
}

declare module "postcss-modules-local-by-default" {
  import { PluginCreator } from "postcss";
  export type Options = { mode?: "local" | "global" | "pure" };
  const plugin: PluginCreator<Options>;
  export default plugin;
}

declare module "postcss-modules-extract-imports" {
  import { PluginCreator } from "postcss";
  export type Options = { failOnWrongOrder?: boolean };
  const plugin: PluginCreator<Options>;
  export default plugin;
}

declare module "postcss-modules-scope" {
  import { PluginCreator } from "postcss";
  export type Options = {
    exportGlobals?: boolean;
    generateScopedName?: (name: string, file: string, css: string) => string;
  };
  const plugin: PluginCreator<Options>;
  export default plugin;
}
