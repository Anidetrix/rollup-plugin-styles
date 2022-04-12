import * as postcss from "postcss";
import cssnano from "cssnano";
import { ImportOptions } from "./loaders/postcss/import";
import { UrlOptions } from "./loaders/postcss/url";
import { ModulesOptions } from "./loaders/postcss/modules";
import { SASSLoaderOptions } from "./loaders/sass";
import { LESSLoaderOptions } from "./loaders/less";
import { StylusLoaderOptions } from "./loaders/stylus";
import { SourceMapOptions, Loader } from "./loaders/types";

/** Options for PostCSS config loader */
export interface PostCSSConfigLoaderOptions {
  /** Path to PostCSS config file directory */
  path?: string;
  /**
   * Context object passed to PostCSS config file
   * @default {}
   */
  ctx?: Record<string, unknown>;
}

/** Options for PostCSS loader */
export interface PostCSSLoaderOptions extends Record<string, unknown> {
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
  /** @see {@link Options.dts} */
  dts: NonNullable<Options["dts"]>;
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
    plugins?: postcss.AcceptedPlugin[];
  };
}

/** CSS data for extraction */
export interface ExtractedData {
  /** CSS */
  css: string;
  /** Sourcemap */
  map?: string;
  /** Output name for CSS */
  name: string;
}

/** Options for CSS injection */
export interface InjectOptions {
  /**
   * Insert `<style>` tag(s) to the beginning of the container
   * @default false
   */
  prepend?: boolean;
  /**
   * Inject CSS into single `<style>` tag only
   * @default false
   */
  singleTag?: boolean;
  /**
   * Container for `<style>` tag(s) injection
   * @default "head"
   */
  container?: string;
  /**
   * Set attributes of injected `<style>` tag(s)
   * - ex.: `{"id":"global"}`
   */
  attributes?: Record<string, string>;
  /**
   * Makes injector treeshakeable,
   * as it is only called when either classes are referenced directly,
   * or `inject` function is called from the default export.
   *
   * Incompatible with `namedExports` option.
   */
  treeshakeable?: boolean;
}

/** `rollup-plugin-styles`'s full option list */
export interface Options {
  /** Files to include for processing */
  include?: ReadonlyArray<string | RegExp> | string | RegExp | null;
  /** Files to exclude from processing */
  exclude?: ReadonlyArray<string | RegExp> | string | RegExp | null;
  /**
   * PostCSS will process files ending with these extensions
   * @default [".css", ".pcss", ".postcss", ".sss"]
   */
  extensions?: string[];
  /**
   * A list of plugins for PostCSS,
   * which are used before plugins loaded from PostCSS config file, if any
   */
  plugins?:
    | Record<string, unknown>
    | (
        | postcss.AcceptedPlugin
        | string
        | [string | postcss.PluginCreator<unknown>]
        | [string | postcss.PluginCreator<unknown>, Record<string, unknown>]
        | null
        | undefined
      )[];
  /**
   * Select mode for this plugin:
   * - `"inject"` *(default)* - Embeds CSS inside JS and injects it into `<head>` at runtime.
   * You can also pass options for CSS injection.
   * Alternatively, you can pass your own CSS injector.
   * - `"extract"` - Extract CSS to the same location where JS file is generated but with `.css` extension.
   * You can also set extraction path manually,
   * relative to output dir/output file's basedir,
   * but not outside of it.
   * - `"emit"` - Emit pure processed CSS and pass it along the build pipeline.
   * Useful if you want to preprocess CSS before using it with CSS consuming plugins.
   * @default "inject"
   */
  mode?:
    | "inject"
    | ["inject"]
    | ["inject", InjectOptions | ((varname: string, id: string) => string)]
    | "extract"
    | ["extract"]
    | ["extract", string]
    | "emit"
    | ["emit"];
  /** `to` option for PostCSS, required for some plugins */
  to?: string;
  /**
   * Generate TypeScript declarations files for input style files
   * @default false
   */
  dts?: boolean;
  /**
   * Enable/disable or pass options for CSS `@import` resolver
   * @default true
   */
  import?: ImportOptions | boolean;
  /**
   * Enable/disable or pass options for CSS URL resolver
   * @default true
   */
  url?: UrlOptions | boolean;
  /**
   * Aliases for URL and import paths
   * - ex.: `{"foo":"bar"}`
   */
  alias?: Record<string, string>;
  /**
   * Enable/disable or pass options for
   * [CSS Modules](https://github.com/css-modules/css-modules)
   * @default false
   */
  modules?: boolean | ModulesOptions;
  /**
   * Automatically enable
   * [CSS Modules](https://github.com/css-modules/css-modules)
   * for files named `[name].module.[ext]`
   * (e.g. `foo.module.css`, `bar.module.stylus`),
   * or pass your own function or regular expression
   * @default false
   */
  autoModules?: boolean | RegExp | ((id: string) => boolean);
  /**
   * Use named exports alongside default export.
   * You can pass a function to control how exported name is generated.
   * @default false
   */
  namedExports?: boolean | ((name: string) => string);
  /**
   * Enable/disable or pass options for
   * [cssnano](https://github.com/cssnano/cssnano)
   * @default false
   */
  minimize?: boolean | cssnano.Options;
  /**
   * Enable/disable or configure sourcemaps
   * @default false
   */
  sourceMap?: boolean | "inline" | [boolean | "inline"] | [boolean | "inline", SourceMapOptions];
  /**
   * Set PostCSS parser, e.g. `sugarss`.
   * Overrides the one loaded from PostCSS config file, if any.
   */
  parser?: string | postcss.Parser;
  /**
   * Set PostCSS stringifier.
   * Overrides the one loaded from PostCSS config file, if any.
   */
  stringifier?: string | postcss.Stringifier;
  /**
   * Set PostCSS syntax.
   * Overrides the one loaded from PostCSS config file, if any.
   */
  syntax?: string | postcss.Syntax;
  /**
   * Enable/disable or pass options for PostCSS config loader
   * @default true
   */
  config?: boolean | PostCSSConfigLoaderOptions;
  /**
   * Array of loaders to use, executed from right to left.
   * Currently built-in loaders are:
   * - `sass` (Supports `.scss` and `.sass` files)
   * - `less` (Supports `.less` files)
   * - `stylus` (Supports `.styl` and `.stylus` files)
   * @default ["sass", "less", "stylus"]
   */
  use?: string[];
  /** Options for Sass loader */
  sass?: SASSLoaderOptions;
  /** Options for Less loader */
  less?: LESSLoaderOptions;
  /** Options for Stylus loader */
  stylus?: StylusLoaderOptions;
  /** Array of custom loaders */
  loaders?: Loader[];
  /**
   * Function which is invoked on CSS file import,
   * before any transformations are applied
   */
  onImport?: (code: string, id: string) => void;
  /**
   * Function which is invoked on CSS file extraction.
   * Return `boolean` to control if file should be extracted or not.
   */
  onExtract?: (data: ExtractedData) => boolean;
}
