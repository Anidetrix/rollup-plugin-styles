declare namespace stylus {
  interface Options {
    imports?: string[];
    paths?: string[];
    filename?: string;
    sourcemap?: {
      comment?: boolean;
      inline?: boolean;
      sourceRoot?: string;
      basePath?: string;
    };
  }

  type Callback = (err: Error, css: string) => void;

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

declare module "stylus" {
  const stylus: stylus.Stylus;
  export = stylus;
}
