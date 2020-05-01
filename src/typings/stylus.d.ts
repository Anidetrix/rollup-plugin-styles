declare module "stylus" {
  import { RawSourceMap } from "source-map";

  export interface Stylus {
    (str: string, options?: RenderOptions): Renderer;
    render(str: string, callback: RenderCallback): void;
    render(str: string, options: RenderOptions, callback: RenderCallback): void;
  }

  class Renderer {
    constructor(str: string, options?: RenderOptions);
    sourcemap?: RawSourceMap;
    render(callback: RenderCallback): void;
    render(): string;
    deps(): string[];
    set<T extends keyof RenderOptions>(key: T, val: RenderOptions[T]): this;
  }

  export interface RenderOptions {
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

  export type RenderCallback = (err: Error, css: string, js: string) => void;

  const stylus: Stylus;
  export default stylus;
}
