declare namespace less {
  interface File {
    contents?: string;
    filename?: string;
  }

  class AbstractFileManager {
    supportsSync(filename: string, basedir: string): boolean;
  }

  interface FileManager extends AbstractFileManager {
    supports(filename: string, basedir: string): boolean;
    loadFile(filename: string, basedir: string): Promise<File>;
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

  interface Options {
    sourceMap?: SourceMapOption;
    filename?: string;
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
    globalVars?: { [x: string]: string };
    modifyVars?: { [x: string]: string };
    syncImport?: boolean;
  }

  interface RenderOutput {
    css: string;
    map: string;
    imports: string[];
  }

  interface Less {
    AbstractFileManager: typeof AbstractFileManager;
    render(input: string, options?: Options): Promise<RenderOutput>;
  }
}

declare module "less" {
  const less: less.Less;
  export = less;
}
