import path from "path";
import { isAbsolutePath, isRelativePath, normalizePath } from "./path";

export const isModule = (url: string): boolean => /^~([\dA-Za-z]|@)\S+/.test(url);

export function getUrlOfPartial(url: string): string {
  const parsedUrl = path.parse(url);
  return `${normalizePath(parsedUrl.dir)}/_${parsedUrl.base}`;
}

export function normalizeUrl(url: string): string {
  if (isModule(url)) return normalizePath(url.slice(1));
  if (isAbsolutePath(url) || isRelativePath(url)) return normalizePath(url);
  return `./${normalizePath(url)}`;
}
