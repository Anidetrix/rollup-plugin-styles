import postcss from "postcss";
import { LoaderContext } from "../loaders/types";
import { Options, PostCSSLoaderOptions } from "../types";
import loadModule from "./load-module";
import arrayFmt from "./array-fmt";

export function inferOption<T, TDef extends T | boolean>(
  option: T | boolean | undefined,
  defaultValue: TDef,
): T | false | TDef {
  if (typeof option === "boolean") return option && ({} as TDef);
  if (typeof option === "object") return option;
  return defaultValue;
}

interface Mode {
  inject: PostCSSLoaderOptions["inject"];
  extract: PostCSSLoaderOptions["extract"];
  emit: PostCSSLoaderOptions["emit"];
}

const modes = ["inject", "extract", "emit"];
const modesFmt = arrayFmt(modes);
export function inferModeOption(mode: Options["mode"]): Mode {
  const m = Array.isArray(mode) ? mode : ([mode] as const);

  if (m[0] && !modes.includes(m[0]))
    throw new Error(`Incorrect mode provided, allowed modes are ${modesFmt}`);

  return {
    inject: (!m[0] || m[0] === "inject") && (m[1] ?? true),
    extract: m[0] === "extract" && (m[1] ?? true),
    emit: m[0] === "emit",
  };
}

export function inferSourceMapOption(sourceMap: Options["sourceMap"]): LoaderContext["sourceMap"] {
  const sm = Array.isArray(sourceMap) ? sourceMap : ([sourceMap] as const);
  if (!sm[0]) return false;
  return { content: true, ...sm[1], inline: sm[0] === "inline" };
}

export function inferHandlerOption<T extends { alias?: Record<string, string> }>(
  option: T | boolean | undefined,
  alias: T["alias"],
): T | false {
  const opt = inferOption(option, {} as T);
  if (alias && typeof opt === "object" && !opt.alias) opt.alias = alias;
  return opt;
}

export function ensureUseOption(opts: Options): [string, Record<string, unknown>][] {
  const all: Record<string, [string, Record<string, unknown>]> = {
    sass: ["sass", opts.sass ?? {}],
    less: ["less", opts.less ?? {}],
    stylus: ["stylus", opts.stylus ?? {}],
  };

  if (typeof opts.use === "undefined") return Object.values(all);
  else if (!Array.isArray(opts.use)) throw new TypeError("`use` option must be an array!");

  return opts.use.map(loader => {
    if (typeof loader !== "string")
      throw new TypeError("`use` option must be an array of strings!");

    return all[loader] || [loader, {}];
  });
}

type PCSSOption = "parser" | "syntax" | "stringifier" | "plugin";
export function ensurePCSSOption<T>(option: T | string, type: PCSSOption): T {
  if (typeof option !== "string") return option;
  const module = loadModule(option);
  if (!module) throw new Error(`Unable to load PostCSS ${type} \`${option}\``);
  return module as T;
}

export function ensurePCSSPlugins(
  plugins: Options["plugins"],
): (postcss.Transformer | postcss.Processor)[] {
  if (typeof plugins === "undefined") return [];
  else if (!Array.isArray(plugins)) throw new TypeError("`plugins` option must be an array!");

  const ps: (postcss.Transformer | postcss.Processor)[] = [];
  for (const p of plugins) {
    if (!p) continue;

    if (!Array.isArray(p)) {
      ps.push(ensurePCSSOption(p, "plugin"));
      continue;
    }

    const [plug, opts] = p;
    if (!opts) ps.push(ensurePCSSOption(plug, "plugin"));
    else ps.push(ensurePCSSOption(plug, "plugin")(opts));
  }

  return ps;
}
