import postcss from "postcss";
import { extractICSS, replaceSymbols, replaceValueSymbols } from "icss-utils";
import { ModulesOptions } from "../modules";
import loadDefault, { Load } from "./load";
import resolve from "./resolve";

const name = "styles-icss";

export interface InteroperableCSSOptions {
  load?: Load;
  getReplacements?: ModulesOptions["getReplacements"];
  extensions?: string[];
}

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

    const replacements = Object.entries(icssExports).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: replaceValueSymbols(v, imports) }),
      {},
    );

    res.messages.push({ plugin: name, type: "icss", replacements });

    if (typeof options.getReplacements === "function")
      options.getReplacements(css.source.input.file, replacements, res.opts?.to);
  },
);

export default plugin;
