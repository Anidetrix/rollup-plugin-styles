import postcss from "postcss";
import { Options, LoadersOptions } from "../types";
import bool from "./boolean-filter";

/** @returns `object` if `option` is truthy, `false` if `option` is `false`, otherwise `defaultValue` */
export function inferOption<O, D extends O>(
  option: O | undefined,
  defaultValue: D,
): Exclude<O, true> | {} | D {
  if (typeof option === "boolean") return option === false ? false : {};
  if (typeof option === "object") return option;
  return defaultValue;
}

export function ensureOption<O, D extends O>(option: O | undefined, defaultValue: D): O | D {
  if (typeof option !== "undefined") return option;
  return defaultValue;
}

export function ensureUseOption(use: Options["use"]): LoadersOptions["use"] {
  if (Array.isArray(use)) return use;
  return [
    ["sass", (use && use.sass) || {}],
    ["stylus", (use && use.stylus) || {}],
    ["less", (use && use.less) || {}],
  ];
}

export function ensurePCSSOption<T>(option: T | string): T {
  if (typeof option === "string") return require(option);
  return option;
}

export function ensurePCSSPlugins(plugins: Options["plugins"]): postcss.Transformer[] | undefined {
  if (!Array.isArray(plugins)) return plugins;
  return plugins.filter(bool).map(p => {
    if (!Array.isArray(p)) return ensurePCSSOption(p);

    const [plug, opts] = p;
    if (!opts) return ensurePCSSOption<postcss.Transformer>(plug);
    return ensurePCSSOption<postcss.PluginInitializer<unknown>>(plug)(opts);
  });
}
