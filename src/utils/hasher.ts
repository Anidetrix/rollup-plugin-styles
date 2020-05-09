import { createHash } from "crypto";

export default (data: string): string => createHash("sha256").update(data).digest("hex");
