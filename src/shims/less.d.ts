declare namespace less {
  interface File {
    contents: string;
    filename: string;
  }

  class AbstractFileManager {
    supportsSync(filename: string, filedir: string): boolean;
  }

  interface FileManager extends AbstractFileManager {
    supports(filename: string, filedir: string): boolean;
    loadFile(filename: string, filedir: string, opts: Options): Promise<File>;
  }

  class PluginManager {
    constructor(less: Less);
    addFileManager(fileManager: FileManager): void;
  }

  interface Plugin {
    install: (less: Less, pluginManager: PluginManager) => void;
  }

  interface SourceMapOption {
    sourceMapURL?: string;
    sourceMapBasepath?: string;
    sourceMapRootpath?: string;
    outputSourceFiles?: boolean;
    sourceMapFileInline?: boolean;
  }

  interface PublicOptions {
    paths?: string[];
    lint?: boolean;
    plugins?: Plugin[];
    compress?: boolean;
    strictImports?: boolean;
    insecure?: boolean;
    depends?: boolean;
    maxLineLen?: number;
    color?: boolean;
    ieCompat?: boolean;
    javascriptEnabled?: boolean;
    dumpLineNumbers?: "comment" | string;
    rootpath?: string;
    math?: "always" | "strict" | "parens-division" | "parens" | "strict-legacy" | number;
    silent?: boolean;
    strictUnits?: boolean;
    globalVars?: Record<string, string>;
    modifyVars?: Record<string, string>;
    syncImport?: boolean;
  }

  interface Options extends PublicOptions {
    sourceMap?: SourceMapOption;
    filename?: string;
  }

  interface RenderOutput {
    css: string;
    map: string;
    imports: string[];
  }

  interface Less {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AbstractFileManager: typeof AbstractFileManager;
    render(input: string, options?: Options): Promise<RenderOutput>;
  }
}
