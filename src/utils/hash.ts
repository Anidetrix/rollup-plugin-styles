import { sha1 } from "hash.js";

export default (data: string): string =>
  sha1()
    .update(data)
    .digest("hex");
