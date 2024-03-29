import path from "path";
import { isAbsolutePath, isRelativePath, normalizePath } from "./path";

export const isModule = (url: string): boolean => /^~[\d@A-Za-z]/.test(url);

export function getUrlOfPartial(url: string): string {
  const { dir, base } = path.parse(url);
  return dir ? `${normalizePath(dir)}/_${base}` : `_${base}`;
}

export function normalizeUrl(url: string): string {
  if (isModule(url)) return normalizePath(url.slice(1));
  if (isAbsolutePath(url) || isRelativePath(url)) return normalizePath(url);
  return `./${normalizePath(url)}`;
}
