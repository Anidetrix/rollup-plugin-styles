import { makeLegalIdentifier } from "@rollup/pluginutils";
import hasher from "./hasher";

export default (id: string, ...salt: string[]): string => {
  const hash = hasher([id, ...salt].join(";")).slice(0, 8);
  return makeLegalIdentifier(`${id}_${hash}`);
};
