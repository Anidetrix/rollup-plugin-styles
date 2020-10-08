declare module "icss-utils" {
  import { Container } from "postcss";

  export type Replacements = Record<string, string>;
  export type CSSImports = Record<string, Record<string, string>>;
  export type CSSExports = Record<string, string>;

  export interface ExtractedICSS {
    icssImports: CSSImports;
    icssExports: CSSExports;
  }

  export function replaceValueSymbols(value: string, replacements: Replacements): string;
  export function replaceSymbols(css: Container, replacements: Replacements): void;
  export function extractICSS(css: Container, removeRules?: boolean): ExtractedICSS;
}
