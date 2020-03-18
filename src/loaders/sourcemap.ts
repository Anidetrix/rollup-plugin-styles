import { Loader } from "../types";
import { stripMap, getMap } from "../utils/sourcemap-utils";

const loader: Loader = {
  name: "sourcemap",
  alwaysProcess: true,
  async process({ code, map }) {
    if (this.sourceMap) map = (await getMap(code, this.id)) || map;
    return { code: stripMap(code), map };
  },
};

export default loader;
