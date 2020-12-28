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
  const options = { caller: "ICSS loader", basedirs: [path.dirname(file)], extensions };
  const from = await resolveAsync([url, `./${url}`], options);
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
