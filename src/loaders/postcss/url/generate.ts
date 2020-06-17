import path from "path";

import hasher from "../../../utils/hasher";

import { hashRe } from "../common";

export default (placeholder: string, file: string, source: Uint8Array): string => {
  const { dir, name, ext, base } = path.parse(file);
  const hash = hasher(`${base}:${Buffer.from(source).toString()}`);
  const match = hashRe.exec(placeholder);
  const hashLen = match && Number.parseInt(match[1]);
  return placeholder
    .replace("[dir]", path.basename(dir))
    .replace("[name]", name)
    .replace("[extname]", ext)
    .replace(".[ext]", ext)
    .replace("[ext]", ext.slice(1))
    .replace(hashRe, hashLen ? hash.slice(0, hashLen) : hash.slice(0, 8));
};
