import postcss from "postcss";
import { extractICSS, replaceSymbols, replaceValueSymbols, Replacements } from "icss-utils";

import loadDefault, { Load } from "./load";
import resolve from "./resolve";

const name = "styles-icss";

export type InteroperableCSSOptions = {
  load?: Load;
  getReplacements?: (file: string, replacements: Replacements, out?: string) => void;
  extensions?: string[];
};

const plugin: postcss.Plugin<InteroperableCSSOptions> = postcss.plugin(
  name,
  (options = {}) => async (css, res): Promise<void> => {
    if (!css.source?.input.file) return;
    if (!res.processor) return;

    const load = options.load ?? loadDefault;
    const extensions = options.extensions ?? [".css", ".pcss", ".postcss", ".sss"];

    const opts = res.opts && { ...res.opts };
    delete opts?.map;

    const { icssExports, icssImports } = extractICSS(css);

    const imports = await resolve(
      icssImports,
      load,
      css.source.input.file,
      extensions,
      res.processor,
      opts,
    );

    replaceSymbols(css, imports);

    const replacements = Object.entries(icssExports).reduce<Replacements>((acc, [k, v]) => {
      acc[k] = replaceValueSymbols(v, imports);
      return acc;
    }, {});

    res.messages.push({ plugin: name, type: "icss", replacements });

    if (typeof options.getReplacements === "function")
      options.getReplacements(css.source.input.file, replacements, res.opts?.to);
  },
);

export default plugin;
