import rollup from "rollup";
import { RawSourceMap } from "source-map";

/**
 * Loader
 * @param T type of loader's options
 */
export interface Loader<T = Record<string, unknown>> {
  /** Name */
  name: string;
  /**
   * Test to control if file should be processed.
   * Also used for plugin's supported files test.
   */
  test?: RegExp | ((file: string) => boolean);
  /** Skip testing, always process the file */
  alwaysProcess?: boolean;
  /** Function for processing */
  process: (this: LoaderContext<T>, payload: Payload) => Promise<Payload> | Payload;
}

/**
 * Loader's context
 * @param T type of loader's options
 */
export interface LoaderContext<T = Record<string, unknown>> {
  /**
   * Loader's options
   * @default {}
   */
  readonly options: T;
  /** @see {@link Options.sourceMap} */
  readonly sourceMap: false | ({ inline: boolean } & SourceMapOptions);
  /** Resource path */
  readonly id: string;
  /** Files to watch */
  readonly deps: Set<string>;
  /** Assets to emit */
  readonly assets: Map<string, Uint8Array>;
  /** [Plugin's context](https://rollupjs.org/guide/en#plugin-context) */
  readonly plugin: rollup.PluginContext;
  /** [Function for emitting a warning](https://rollupjs.org/guide/en/#thiswarnwarning-string--rollupwarning-position-number---column-number-line-number---void) */
  readonly warn: rollup.PluginContext["warn"];
}

/** Extracted data */
export interface Extracted {
  /** Source file path */
  id: string;
  /** CSS */
  css: string;
  /** Sourcemap */
  map?: string;
}

/** Loader's payload */
export interface Payload {
  /** File content */
  code: string;
  /** Sourcemap */
  map?: string;
  /** Extracted data */
  extracted?: Extracted;
}

/** Options for sourcemaps */
export interface SourceMapOptions {
  /**
   * Include sources content
   * @default true
   */
  content?: boolean;
  /** Fuction for transforming final source map */
  transform?: (map: RawSourceMap) => void;
}
