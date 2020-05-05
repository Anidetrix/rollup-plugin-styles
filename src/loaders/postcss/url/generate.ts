import path from "path";

import hasher from "../../../utils/hasher";
import { humanlizePath } from "../../../utils/path";

import { hashRe } from "../common";

export default (placeholder: string, file: string, source: Uint8Array): string => {
  const hash = hasher(Buffer.from(source).toString() + humanlizePath(file));
  const match = hashRe.exec(placeholder);
  const hashLen = match && Number.parseInt(match[1]);
  return placeholder
    .replace("[dir]", path.basename(path.dirname(file)))
    .replace("[name]", path.basename(file, path.extname(file)))
    .replace("[extname]", path.extname(file))
    .replace(".[ext]", path.extname(file))
    .replace("[ext]", path.extname(file).slice(1))
    .replace(hashRe, hashLen ? hash.slice(0, hashLen) : hash.slice(0, 8));
};
