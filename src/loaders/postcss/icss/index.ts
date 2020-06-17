import postcss from "postcss";
import { extractICSS, replaceSymbols, replaceValueSymbols } from "icss-utils";
import loadDefault, { Load } from "./load";
import resolve from "./resolve";

const name = "styles-icss";
const extensionsDefault = [".css", ".pcss", ".postcss", ".sss"];

export interface InteroperableCSSOptions {
  load?: Load;
  extensions?: string[];
}

const plugin: postcss.Plugin<InteroperableCSSOptions> = postcss.plugin(
  name,
  (options = {}) => async (css, res): Promise<void> => {
    if (!css.source?.input.file) return;
    if (!res.processor) return;

    const load = options.load ?? loadDefault;
    const extensions = options.extensions ?? extensionsDefault;

    const opts: postcss.ResultOptions = { ...res.opts };
    delete opts.map;

    const { icssImports, icssExports } = extractICSS(css);

    const imports = await resolve(
      icssImports,
      load,
      css.source.input.file,
      extensions,
      res.processor,
      opts,
    );

    replaceSymbols(css, imports);

    for (const [k, v] of Object.entries(icssExports)) {
      res.messages.push({
        plugin: name,
        type: "icss",
        export: { [k]: replaceValueSymbols(v, imports) },
      });
    }
  },
);

export default plugin;
