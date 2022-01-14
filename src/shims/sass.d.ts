declare namespace sass {
  type Data = { file: string } | { contents: string } | Error | null;

  type Importer = (url: string, prev: string, done: (data: Data) => void) => Data | void;

  interface PublicOptions {
    data?: string;
    importer?: Importer | Importer[];
    includePaths?: string[];
    indentType?: "space" | "tab";
    indentWidth?: number;
    linefeed?: "cr" | "crlf" | "lf" | "lfcr";
    outputStyle?: "compressed" | "expanded";
  }

  interface Options extends PublicOptions {
    file?: string;
    indentedSyntax?: boolean;
    omitSourceMapUrl?: boolean;
    outFile?: string;
    sourceMap?: boolean | string;
    sourceMapContents?: boolean;
    sourceMapEmbed?: boolean;
    sourceMapRoot?: string;
  }

  interface Exception extends Error {
    message: string;
    formatted: string;
    line: number;
    column: number;
    status: number;
    file: string;
  }

  interface Result {
    css: Uint8Array;
    map?: Uint8Array;
    stats: { includedFiles: string[] };
  }

  type Callback = (exception: Exception, result: Result) => void;

  interface Sass {
    render: (options: Options, callback: Callback) => void;
    renderSync: (options: Options) => Result;
  }
}
