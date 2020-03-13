import { Loader } from "../types";
import { getMap, stripMap } from "../utils/sourcemap-utils";

const loader: Loader = {
  name: "sourcemap",
  alwaysProcess: true,
  async process({ code, map }) {
    if (!map) map = await getMap(code, this.id);
    return { code: stripMap(code), map };
  },
};

export default loader;
