/* eslint-disable @typescript-eslint/no-var-requires */
import { sync as resolveSync, SyncOpts } from "resolve";

const loaded: Record<string, unknown> = {};
const options: SyncOpts = { basedir: process.cwd(), preserveSymlinks: false };
export default function (moduleId: string): unknown {
  if (loaded[moduleId]) return loaded[moduleId];
  if (loaded[moduleId] === null) return;

  try {
    try {
      loaded[moduleId] = require(resolveSync(moduleId, options)) as unknown;
    } catch {
      loaded[moduleId] = require(resolveSync(`./${moduleId}`, options)) as unknown;
    }
  } catch {
    loaded[moduleId] = null;
    return;
  }

  return loaded[moduleId];
}
