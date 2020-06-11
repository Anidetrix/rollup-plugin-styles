declare namespace stylus {
  type Callback = (err: Error, css: string) => void;

  interface SourceMapOptions {
    comment?: boolean;
    inline?: boolean;
    sourceRoot?: string;
    basePath?: string;
  }

  interface PublicOptions {
    imports?: string[];
    paths?: string[];
  }

  interface Options extends PublicOptions {
    filename?: string;
    sourcemap?: SourceMapOptions;
  }

  interface Renderer {
    render(callback: Callback): void;
    deps(): string[];
    set<T extends keyof Options>(key: T, val: Options[T]): this;
    sourcemap?: {
      version: number;
      sources: string[];
      names: string[];
      sourceRoot?: string;
      sourcesContent?: string[];
      mappings: string;
      file: string;
    };
  }

  interface Stylus {
    (code: string, options?: Options): Renderer;
  }
}
