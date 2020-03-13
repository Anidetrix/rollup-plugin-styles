import { makeLegalIdentifier } from "@rollup/pluginutils";
import hash from "./hash";

export default (id: string): string => {
  const hashed = hash(id).slice(0, 8);
  return makeLegalIdentifier(`${id}_${hashed}`);
};
