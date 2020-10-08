import path from "path";
import fs from "fs-extra";
import { ProcessOptions } from "postcss";
import Processor from "postcss/lib/processor";
import resolveAsync from "../../../utils/resolve-async";

export type Load = (
  url: string,
  file: string,
  extensions: string[],
  processor: Processor,
  opts?: ProcessOptions,
) => Promise<Record<string, string>>;

const load: Load = async (url, file, extensions, processor, opts) => {
  let from: string;
  const options = { basedir: path.dirname(file), extensions };
  try {
    from = await resolveAsync(url, options);
  } catch {
    from = await resolveAsync(`./${url}`, options);
  }

  const source = await fs.readFile(from);
  const { messages } = await processor.process(source, { ...opts, from });

  const exports: Record<string, string> = {};
  for (const msg of messages) {
    if (msg.type !== "icss") continue;
    Object.assign(exports, msg.export as Record<string, string>);
  }

  return exports;
};

export default load;
