import { sha1 } from "hash.js";

/**
 * Generate hash from data
 * @param data hashable data
 * @returns hash
 */
export default (data: string): string =>
  sha1()
    .update(data)
    .digest("hex");
