import postcss from "postcss";
import { CSSImports, Replacements } from "icss-utils";

import { Load } from "./load";

export default async function (
  icssImports: CSSImports,
  load: Load,
  file: string,
  extensions: string[],
  processor: postcss.Processor,
  opts?: postcss.ProcessOptions,
): Promise<Replacements> {
  return Object.entries(icssImports).reduce(async (result, [url, values]) => {
    const exports = await load(url, file, extensions, processor, opts);
    const mappedValues = Object.entries(values).reduce<Replacements>((acc, [k, v]) => {
      acc[k] = exports[v];
      return acc;
    }, {});
    return { ...(await result), ...mappedValues };
  }, Promise.resolve({}));
}
