/// <reference types="./fibers" />

declare module "sass" {
  import { FiberConstructor } from "fibers";

  export type ImporterReturnType = { file: string } | { contents: string } | Error | null;

  export type Importer = (
    url: string,
    prev: string,
    done: (data: ImporterReturnType) => void,
  ) => ImporterReturnType | void;

  export interface Options {
    fiber?: FiberConstructor;
    file?: string;
    data?: string;
    importer?: Importer | Importer[];
    includePaths?: string[];
    indentedSyntax?: boolean;
    indentType?: "space" | "tab";
    indentWidth?: number;
    linefeed?: "cr" | "crlf" | "lf" | "lfcr";
    omitSourceMapUrl?: boolean;
    outFile?: string;
    outputStyle?: "compressed" | "expanded";
    sourceMap?: boolean | string;
    sourceMapContents?: boolean;
    sourceMapEmbed?: boolean;
    sourceMapRoot?: string;
  }

  export interface SassException extends Error {
    message: string;
    formatted: string;
    line: number;
    column: number;
    status: number;
    file: string;
  }

  export interface Result {
    css: Buffer;
    map?: Buffer;
    stats: {
      entry: string;
      start: number;
      end: number;
      duration: number;
      includedFiles: string[];
    };
  }

  export interface Sass {
    render: (
      options: Options,
      callback: (exception: SassException, result: Result) => void,
    ) => void;
    renderSync: (options: Options) => Result;
  }

  const sass: Sass;
  export default sass;
}

declare module "node-sass" {
  export * from "sass";
}
