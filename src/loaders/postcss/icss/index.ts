import { PluginCreator, Result } from "postcss";
import { extractICSS, replaceSymbols, replaceValueSymbols } from "icss-utils";
import loadDefault, { Load } from "./load";
import resolve from "./resolve";

const name = "styles-icss";
const extensionsDefault = [".css", ".pcss", ".postcss", ".sss"];

export interface InteroperableCSSOptions {
  load?: Load;
  extensions?: string[];
}

const plugin: PluginCreator<InteroperableCSSOptions> = (options = {}) => {
  const load = options.load ?? loadDefault;
  const extensions = options.extensions ?? extensionsDefault;

  return {
    postcssPlugin: name,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async OnceExit(css, { result: res }) {
      if (!css.source?.input.file) return;

      const opts: Result["opts"] = { ...res.opts };
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

      for (const key of Object.keys(icssImports)) {
        res.messages.push({
          plugin: name,
          type: "icss-dependency",
          import: key,
        });
      }
    },
  };
};

plugin.postcss = true;
export default plugin;
