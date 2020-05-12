import path from "path";
import fs from "fs-extra";
import postcss from "postcss";
import { Replacements } from "icss-utils";

import resolveAsync from "../../../utils/resolve-async";

export type Load = (
  url: string,
  file: string,
  extensions: string[],
  processor: postcss.Processor,
  opts?: postcss.ProcessOptions,
) => Promise<Replacements>;

const load: Load = async (url, file, extensions, processor, opts) => {
  let from: string;
  const options = { basedir: path.dirname(file), extensions };
  try {
    from = await resolveAsync(url, options);
  } catch (error) {
    from = await resolveAsync(`./${url}`, options);
  }
  const source = await fs.readFile(from);
  const { messages } = await processor.process(source, { ...opts, from });
  return messages
    .filter(msg => msg.type === "icss")
    .reduce((acc, msg) => ({ ...acc, ...msg.replacements }), {});
};

export default load;
