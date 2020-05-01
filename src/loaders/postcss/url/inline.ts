import { lookup } from "mime-types";

export default (file: string, source: Uint8Array): string => {
  const mime = lookup(file) || "application/octet-stream";
  const data = Buffer.from(source).toString("base64");
  return `data:${mime};base64,${data}`;
};
