import path from "path";
import fs from "fs-extra";
import postcss from "postcss";
import { Replacements } from "icss-utils";

import resolveAsync from "../../../utils/resolve-async";
import { normalizeUrl } from "../../../utils/url";

export type Load = (
  url: string,
  file: string,
  extensions: string[],
  processor: postcss.Processor,
  opts?: postcss.ProcessOptions,
) => Promise<Replacements>;

const load: Load = async (url, file, extensions, processor, opts) => {
  const from = await resolveAsync(normalizeUrl(url), { basedir: path.dirname(file), extensions });
  const source = await fs.readFile(from);
  const { messages } = await processor.process(source, { ...opts, from });
  return messages
    .filter(msg => msg.type === "icss")
    .map<Replacements>(msg => msg.replacements)
    .reduce((prev, current) => ({ ...prev, ...current }));
};

export default load;
