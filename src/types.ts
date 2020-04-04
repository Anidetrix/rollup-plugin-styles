import postcss from "postcss";
import cssnano from "cssnano";
import { PluginContext } from "rollup";
import { Importer as SASSImporter } from "sass";
import { Plugin as LESSPlugin } from "less";
import { LocalByDefaultOptions } from "postcss-modules-local-by-default";
import { ExtractImportsOptions } from "postcss-modules-extract-imports";
import { ScopeOptions } from "postcss-modules-scope";

/** Object, which properties are unknown */
export type ObjectWithUnknownProps = { [prop: string]: unknown };

/** `postcss-load-config`'s options */
export interface PostCSSLoadConfigOptions {
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
}

/** Options for PostCSS Loader */
export type PostCSSLoaderOptions = {
  /** @see {@link Options.minimize} */
  minimize: Exclude<Options["minimize"], true | undefined>;
  /** @see {@link Options.config} */
  config: Exclude<Options["config"], true | undefined>;
  /** @see {@link Options.modules} */
  modules: Exclude<Options["modules"], true | undefined>;

  /** @see {@link Options.inject} */
  inject: NonNullable<Options["inject"]>;
  /** @see {@link Options.extract} */
  extract: NonNullable<Options["extract"]>;
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
};

/** Options for Less Loader */
export type LESSLoaderOptions = {
  /**
   * Array of Less plugins
   * @default undefined
   */
  plugins?: LESSPlugin[];
};

/** Options for {@link Loaders} class */
export interface LoadersOptions {
  /** @see {@link Options.use} */
  use: (string | [string] | [string, ObjectWithUnknownProps])[];
  /** @see {@link Options.loaders} */
  loaders: Loader[];
  /** @see {@link Options.extensions} */
  extensions: string[];
}

/**
 * Loader
 * @param LoaderOptionsType type of loader's options
 * */
export interface Loader<LoaderOptionsType = ObjectWithUnknownProps> {
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
  process: (this: LoaderContext<LoaderOptionsType>, payload: Payload) => Promise<Payload> | Payload;
}

/**
 * Loader's context
 * @param LoaderOptionsType type of loader's options
 * */
export interface LoaderContext<LoaderOptionsType = ObjectWithUnknownProps> {
  /**
   * Loader's options
   * @default {}
   * */
  options: LoaderOptionsType;
  /** @see {@link Options.sourceMap} */
  sourceMap?: boolean | "inline";
  /** Resource path */
  id: string;
  /** Files to watch */
  dependencies: Set<string>;
  /** Function for emitting a waring */
  warn: PluginContext["warn"];
  /** Function for emitting an error */
  error: PluginContext["error"];
  /** https://rollupjs.org/guide/en#plugin-context */
  plugin: PluginContext;
}

/** Loader's payload */
export interface Payload {
  /** File content */
  code: string;
  /** Sourcemap */
  map?: string;
  /** Extracted data */
  extracted?: {
    /** Source file path */
    id: string;
    /** File content */
    code: string;
    /** Sourcemap */
    map?: string;
  };
}

/** CSS data, extracted from JS */
export interface ExtractedData {
  /** CSS */
  code: string;
  /** Output filename for CSS */
  codeFileName: string;
  /** Sourcemap */
  map?: string;
  /** Output filename for sourcemap */
  mapFileName: string;
}

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
  /** Placeholder or function for scoped name generation */
  generateScopedName?: string | ScopeOptions["generateScopedName"];
  /** Function for resulting JSON extraction */
  getJSON?: (file: string, json: { [k: string]: string }, out?: string) => void;
};

/** `rollup-plugin-styles`'s full option list */
export interface Options {
  /**
   * Files to include for processing.
   * @default undefined
   * */
  include?: string | RegExp | (string | RegExp)[];
  /**
   * Files to exclude from processing.
   * @default undefined
   * */
  exclude?: string | RegExp | (string | RegExp)[];
  /**
   * PostCSS will process files ending with these extensions.
   * @default [".css", ".sss", ".pcss"]
   * */
  extensions?: string[];
  /**
   * A list of plugins for PostCSS.
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
   * Inject CSS into `<head>`, it's always false when `extract: true`.
   * You can also use it as options for CSS injection.
   * It can also be a `function`, returning a `string` with js code.
   * @default true
   * */
  inject?:
    | boolean
    | {
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
         * @default document.head
         * */
        container?: HTMLElement;
      }
    | ((varname: string, id: string) => string);
  /**
   * Extract CSS to the same location where JS file is generated but with .css extension.
   * You can also set it to an absolute or relative to current working directory path, which will also act as `to` option for PostCSS
   * @default false
   * */
  extract?: boolean | string;
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
   * - ex.: `foo.module.css`, `bar.module.stylus`, etc...
   * @default false
   * */
  autoModules?: boolean;
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
   * Enable sourceMap.
   * @default false
   * */
  sourceMap?: boolean | "inline";
  /**
   * Set PostCSS parser, like `sugarss`.
   * @default undefined
   * */
  parser?: string | postcss.Parser;
  /**
   * Set PostCSS stringifier.
   * @default undefined
   * */
  stringifier?: string | postcss.Stringifier;
  /**
   * Set PostCSS syntax.
   * @default undefined
   * */
  syntax?: string | postcss.Syntax;
  /**
   * Enable loading PostCSS config file.
   * @default true
   * */
  config?: boolean | PostCSSLoadConfigOptions;
  /**
   * Array of loaders to use, executed from right to left, or object with loader's properties.
   * Currently built-in loaders are:
   * - `sass` (Supports `.scss` and `.sass` files)
   * - `stylus` (Supports `.styl` and `.stylus` files)
   * - `less` (Supports `.less` files)
   * @default ["sass", "stylus", "less"]
   * */
  use?:
    | (string | [string] | [string, ObjectWithUnknownProps])[]
    | {
        sass?: SASSLoaderOptions & ObjectWithUnknownProps;
        stylus?: ObjectWithUnknownProps;
        less?: LESSLoaderOptions & ObjectWithUnknownProps;
      };
  /**
   * Array of custom loaders.
   * @default undefined
   * */
  loaders?: Loader[];
  /**
   * A `function` which is invoked on CSS file import.
   * @default undefined
   * */
  onImport?: (code: string, id: string) => void;
  /**
   * A `function` which is invoked on CSS file import.
   * Return `boolean` to decide if you want to extract the file or not.
   * @default undefined
   * */
  onExtract?: (fn: () => ExtractedData) => boolean;
}
