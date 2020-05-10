import postcss from "postcss";
import cssnano from "cssnano";
import { CreateFilter } from "@rollup/pluginutils";
import { PluginContext } from "rollup";
import { Importer as SASSImporter } from "sass";
import { Plugin as LESSPlugin } from "less";
import { ModulesOptions } from "./loaders/postcss/modules";
import { UrlOptions } from "./loaders/postcss/url";
import { ImportOptions } from "./loaders/postcss/import";

/** Object, which properties are unknown */
export type ObjectWithUnknownProps = { [prop: string]: unknown };

/** `postcss-load-config`'s options */
export type PostCSSLoadConfigOptions = {
  /**
   * Path to PostCSS config file directory
   * @default undefined
   */
  path?: string;
  /**
   * Context object passed to PostCSS config file
   * @default {}
   */
  ctx?: ObjectWithUnknownProps;
};

/** Options for PostCSS Loader */
export type PostCSSLoaderOptions = {
  /** @see {@link Options.minimize} */
  minimize: Exclude<Options["minimize"], true | undefined>;
  /** @see {@link Options.config} */
  config: Exclude<Options["config"], true | undefined>;
  /** @see {@link Options.import} */
  import: Exclude<Options["import"], true | undefined>;
  /** @see {@link Options.url} */
  url: Exclude<Options["url"], true | undefined>;
  /** @see {@link Options.modules} */
  modules: Exclude<Options["modules"], true | undefined>;

  /** @see {@link Options.mode} */
  inject: boolean | InjectOptions | ((varname: string, id: string) => string);
  /** @see {@link Options.mode} */
  extract: boolean | string;
  /** @see {@link Options.mode} */
  emit: boolean;

  /** @see {@link Options.to} */
  to: Options["to"];
  /** @see {@link Options.namedExports} */
  namedExports: NonNullable<Options["namedExports"]>;
  /** @see {@link Options.autoModules} */
  autoModules: NonNullable<Options["autoModules"]>;
  /** @see {@link Options.extensions} */
  extensions: NonNullable<Options["extensions"]>;

  /** Options for PostCSS processor */
  postcss: {
    /** @see {@link Options.parser} */
    parser?: postcss.Parser;
    /** @see {@link Options.syntax} */
    syntax?: postcss.Syntax;
    /** @see {@link Options.stringifier} */
    stringifier?: postcss.Stringifier;
    /** @see {@link Options.plugins} */
    plugins?: postcss.Transformer[];
  };
};

/** Options for Sass Loader */
export type SASSLoaderOptions = {
  /**
   * Sass importer, or array of such
   * @default undefined
   */
  importer?: SASSImporter | SASSImporter[];
  /**
   * Data to prepend to every Sass file
   * @default undefined
   */
  data?: string;
  /** Force Sass implementation */
  impl?: "node-sass" | "sass";
  /** Forcefully disable/enable `fibers` */
  fibers?: boolean;
  /** Any options for `sass` processor */
  [option: string]: unknown;
};

/** Options for Stylus loader */
export type StylusLoaderOptions = {
  /** Any options for `stylus` processor */
  [option: string]: unknown;
};

/** Options for Less Loader */
export type LESSLoaderOptions = {
  /**
   * Array of Less plugins
   * @default undefined
   */
  plugins?: LESSPlugin[];
  /** Any options for `less` processor */
  [option: string]: unknown;
};

/** Options for {@link Loaders} class */
export type LoadersOptions = {
  /** @see {@link Options.use} */
  use: (string | [string] | [string, ObjectWithUnknownProps])[];
  /** @see {@link Options.loaders} */
  loaders: Loader[];
  /** @see {@link Options.extensions} */
  extensions: string[];
};

/**
 * Loader
 * @param LoaderOptionsType type of loader's options
 * */
export type Loader<TLoaderOptions = ObjectWithUnknownProps> = {
  /** Name */
  name: string;
  /**
   * Test to decide if file should be processed.
   * Also used for plugin's supported files test.
   * */
  test?: RegExp | ((filepath: string) => boolean);
  /** Skip testing, always process the file */
  alwaysProcess?: boolean;
  /** Function for processing */
  process: (this: LoaderContext<TLoaderOptions>, payload: Payload) => Promise<Payload> | Payload;
};

/**
 * Loader's context
 * @param LoaderOptionsType type of loader's options
 * */
export type LoaderContext<TLoaderOptions = ObjectWithUnknownProps> = {
  /**
   * Loader's options
   * @default {}
   * */
  readonly options: TLoaderOptions;
  /** @see {@link Options.sourceMap} */
  readonly sourceMap?: boolean | "inline";
  /** Resource path */
  readonly id: string;
  /** Files to watch */
  readonly deps: Set<string>;
  /** Assets to emit */
  readonly assets: Map<string, Uint8Array>;
  /** Function for emitting a waring */
  readonly warn: PluginContext["warn"];
  /** https://rollupjs.org/guide/en#plugin-context */
  readonly plugin: PluginContext;
};

/** Loader's payload */
export type Payload = {
  /** File content */
  code: string;
  /** Sourcemap */
  map?: string;
  /** Extracted data */
  extracted?: {
    /** Source file path */
    id: string;
    /** CSS */
    css: string;
    /** Sourcemap */
    map?: string;
  };
};

/** CSS data, extracted from JS */
export type ExtractedData = {
  /** CSS */
  css: string;
  /** Sourcemap */
  map?: string;
  /** Output name for CSS */
  name: string;
};

/** Options for CSS injection */
export type InjectOptions = {
  /**
   * Insert `<style>` tag into container as a first child
   * @default false
   * */
  prepend?: boolean;
  /**
   * Inject CSS into single `<style>` tag only
   * @default false
   * */
  singleTag?: boolean;
  /**
   * Container for `<style>` tag(s) injection
   * @default "head"
   * */
  container?: string;
};

/** `rollup-plugin-styles`'s full option list */
export interface Options {
  /**
   * Files to include for processing.
   * @default undefined
   * */
  include?: Parameters<CreateFilter>[0];
  /**
   * Files to exclude from processing.
   * @default undefined
   * */
  exclude?: Parameters<CreateFilter>[1];
  /**
   * PostCSS will process files ending with these extensions.
   * @default [".css", ".pcss", ".postcss", ".sss"]
   * */
  extensions?: string[];
  /**
   * A list of plugins for PostCSS,
   * which are used before plugins loaded from PostCSS config file, if any
   * @default undefined
   * */
  plugins?: (
    | postcss.Transformer
    | string
    | [string]
    | [string, ObjectWithUnknownProps]
    | null
    | undefined
  )[];
  /**
   * Select mode for this plugin
   * - `"inject"` *(default)* - Embeds CSS inside JS and injects it into `<head>` at runtime.
   * You can also pass options for CSS injection.
   * Alternatively, you can pass your own CSS injector.
   * - `"extract"` - Extract CSS to the same location where JS file is generated but with .css extension.
   * You can also set extraction path manually,
   * relative to output dir/output file's basedir,
   * but not outside of it.
   * - `"emit"` - Emit pure processed CSS for other plugins in the build pipeline.
   * Useful when you only need to preprocess CSS.
   * @default "inject"
   * */
  mode?:
    | "inject"
    | ["inject", InjectOptions | ((varname: string, id: string) => string)]
    | "extract"
    | ["extract", string]
    | "emit"
    | ["emit"];
  /**
   * `to` option for PostCSS, required for some plugins
   * */
  to?: string;
  /**
   * Enable/disable or pass options for CSS `@import` resolver
   * @default true
   * */
  import?: ImportOptions | boolean;
  /**
   * Enable/disable or pass options for CSS URL resolver
   * @default true
   * */
  url?: UrlOptions | boolean;
  /**
   * Aliases for URL and import paths.
   * - ex.: `{"foo":"bar"}`
   */
  alias?: { [from: string]: string };
  /**
   * Enable and optionally pass additional configuration for
   * [CSS Modules](https://github.com/css-modules/css-modules)
   * @default false
   * */
  modules?: boolean | ModulesOptions;
  /**
   * Automatically enable
   * [CSS Modules](https://github.com/css-modules/css-modules)
   * for files named `[name].module.[ext]`
   * (e.g. `foo.module.css`, `bar.module.stylus`),
   * or pass your own function or regular expression
   * @default false
   * */
  autoModules?: boolean | RegExp | ((id: string) => boolean);
  /**
   * Use named exports alongside default export.
   * You can supply a function to control how exported name is generated.
   * @default false
   * */
  namedExports?: boolean | ((name: string) => string);
  /**
   * Enable CSS minification and optionally pass additional configuration for
   * [cssnano](https://github.com/cssnano/cssnano)
   * @default false
   * */
  minimize?: boolean | cssnano.CssNanoOptions;
  /**
   * Enable sourcemaps.
   * @default false
   * */
  sourceMap?: boolean | "inline";
  /**
   * Set PostCSS parser, e.g. `sugarss`.
   * Overrides the one loaded from PostCSS config file, if any
   * @default undefined
   * */
  parser?: string | postcss.Parser;
  /**
   * Set PostCSS stringifier.
   * Overrides the one loaded from PostCSS config file, if any
   * @default undefined
   * */
  stringifier?: string | postcss.Stringifier;
  /**
   * Set PostCSS syntax.
   * Overrides the one loaded from PostCSS config file, if any
   * @default undefined
   * */
  syntax?: string | postcss.Syntax;
  /**
   * Enable loading PostCSS config file.
   * @default true
   * */
  config?: boolean | PostCSSLoadConfigOptions;
  /**
   * Array of loaders to use, executed from right to left.
   * Currently built-in loaders are:
   * - `sass` (Supports `.scss` and `.sass` files)
   * - `stylus` (Supports `.styl` and `.stylus` files)
   * - `less` (Supports `.less` files)
   * @default ["sass", "stylus", "less"]
   * */
  use?: string[];
  /** Options for Sass loader */
  sass?: SASSLoaderOptions;
  /** Options for Stylus loader */
  stylus?: StylusLoaderOptions;
  /** Options for Less loader */
  less?: LESSLoaderOptions;
  /**
   * Array of custom loaders.
   * @default undefined
   * */
  loaders?: Loader[];
  /**
   * Function which is invoked on CSS file import.
   * @default undefined
   * */
  onImport?: (code: string, id: string) => void;
  /**
   * Function which is invoked on CSS file import.
   * Return `boolean` to decide if you want to extract the file or not.
   * @default undefined
   * */
  onExtract?: (fn: (name: string, ids: string[]) => ExtractedData) => boolean;
}
