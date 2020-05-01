import { makeLegalIdentifier } from "@rollup/pluginutils";

import path from "path";

import hasher from "../../../utils/hasher";

import { hashRe } from "../common";

export default (placeholder = "[name]_[local]__[hash:8]") => (
  name: string,
  file: string,
  css: string,
): string => {
  const hash = hasher(css);
  const match = hashRe.exec(placeholder);
  const hashLen = match && Number.parseInt(match[1]);
  return makeLegalIdentifier(
    placeholder
      .replace("[dir]", path.basename(path.dirname(file)))
      .replace("[name]", path.basename(file, path.extname(file)))
      .replace("[local]", name)
      .replace(hashRe, hashLen ? hash.slice(0, hashLen) : hash),
  );
};
