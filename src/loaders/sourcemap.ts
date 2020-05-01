import { Loader } from "../types";
import { getMap, stripMap } from "../utils/sourcemap";

const loader: Loader<{}> = {
  name: "sourcemap",
  alwaysProcess: true,
  async process({ code, map }) {
    map = (await getMap(code, this.id)) ?? map;
    return { code: stripMap(code), map };
  },
};

export default loader;
