import { makeLegalIdentifier } from "@rollup/pluginutils";

import path from "path";

import hasher from "../../../utils/hasher";

import { hashRe } from "../common";

export default (placeholder = "[name]_[local]__[hash:8]") => (
  local: string,
  file: string,
  css: string,
): string => {
  const { dir, name, base } = path.parse(file);
  const hash = hasher(`${base}:${css}`);
  const match = hashRe.exec(placeholder);
  const hashLen = match && Number.parseInt(match[1]);
  return makeLegalIdentifier(
    placeholder
      .replace("[dir]", path.basename(dir))
      .replace("[name]", name)
      .replace("[local]", local)
      .replace(hashRe, hashLen ? hash.slice(0, hashLen) : hash),
  );
};
