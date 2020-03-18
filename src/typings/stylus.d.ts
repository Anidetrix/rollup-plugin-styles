declare module "stylus" {
  import { ExistingRawSourceMap } from "rollup";

  export interface Stylus {
    (str: string): Renderer;
    (str: string, options: RenderOptions): Renderer;
    render(str: string, callback: RenderCallback): void;
    render(str: string, options: RenderOptions, callback: RenderCallback): void;
  }

  export class Renderer {
    constructor(str: string);
    constructor(str: string, options: RenderOptions);
    sourcemap?: ExistingRawSourceMap;
    render(callback: RenderCallback): void;
    render(): string;
    deps(): string[];
    set<K extends keyof RenderOptions>(key: K, val: RenderOptions[K]): this;
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
