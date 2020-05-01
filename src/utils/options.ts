import postcss from "postcss";
import {
  LoadersOptions,
  Options,
  PostCSSLoaderOptions,
  SASSLoaderOptions,
  StylusLoaderOptions,
  LESSLoaderOptions,
  ObjectWithUnknownProps,
} from "../types";
import { nullishFilter } from "./filter";

export function inferOption<T, TDef extends T | boolean>(
  option: T | boolean | undefined,
  defaultValue: TDef,
): T | false | TDef {
  if (typeof option === "boolean") return option && ({} as TDef);
  if (typeof option === "object") return option;
  return defaultValue;
}

type Mode = {
  inject: PostCSSLoaderOptions["inject"];
  extract: PostCSSLoaderOptions["extract"];
  emit: PostCSSLoaderOptions["emit"];
};
export function inferModeOption(mode: Options["mode"]): Mode {
  const m = Array.isArray(mode)
    ? {
        inject: mode[0] === "inject" ? mode[1] ?? true : false,
        extract: mode[0] === "extract" ? mode[1] ?? true : false,
        emit: mode[0] === "emit",
      }
    : {
        inject: mode === "inject",
        extract: mode === "extract",
        emit: mode === "emit",
      };
  if (!(m.inject || m.extract || m.emit)) m.inject = true;
  return m;
}

export function inferResolverOption<T extends { alias?: { [from: string]: string } }>(
  url: T | boolean | undefined,
  alias: T["alias"],
): T | false {
  const u = inferOption(url, { alias } as T);
  if (typeof u === "object" && !u.alias) u.alias = alias;
  return u;
}

type UseOpts = {
  sass?: SASSLoaderOptions;
  stylus?: StylusLoaderOptions;
  less?: LESSLoaderOptions;
};
export function ensureUseOption(use: Options["use"], opts: UseOpts): LoadersOptions["use"] {
  const sass = ["sass", opts.sass ?? {}] as [string, ObjectWithUnknownProps];
  const stylus = ["stylus", opts.stylus ?? {}] as [string, ObjectWithUnknownProps];
  const less = ["less", opts.less ?? {}] as [string, ObjectWithUnknownProps];
  if (!Array.isArray(use)) return [sass, stylus, less];

  return use.map(loader => {
    switch (loader) {
      case "sass":
        return sass;
      case "stylus":
        return stylus;
      case "less":
        return less;
      default:
        return loader;
    }
  });
}

export function ensurePCSSOption<T>(option: T | string): T {
  if (typeof option === "string") return require(option);
  return option;
}

export function ensurePCSSPlugins(plugins: Options["plugins"]): postcss.Transformer[] | undefined {
  if (!Array.isArray(plugins)) return ensurePCSSOption(plugins);
  return plugins.filter(nullishFilter).map(p => {
    if (!Array.isArray(p)) return ensurePCSSOption(p);

    const [plug, opts] = p;
    if (!opts) return ensurePCSSOption<postcss.Transformer>(plug);
    return ensurePCSSOption<postcss.Plugin<unknown>>(plug)(opts);
  });
}
