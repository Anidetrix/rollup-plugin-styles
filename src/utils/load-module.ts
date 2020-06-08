/* eslint-disable @typescript-eslint/no-var-requires */
import { sync as resolveSync } from "resolve";

const loaded: Record<string, unknown> = {};
export default function (moduleId: string, basedir = process.cwd()): unknown | undefined {
  if (loaded[moduleId]) return loaded[moduleId];
  if (loaded[moduleId] === null) return;

  try {
    try {
      loaded[moduleId] = require(resolveSync(moduleId, { basedir })) as unknown;
    } catch {
      loaded[moduleId] = require(resolveSync(`./${moduleId}`, { basedir })) as unknown;
    }
  } catch {
    loaded[moduleId] = null;
    return;
  }

  return loaded[moduleId];
}
