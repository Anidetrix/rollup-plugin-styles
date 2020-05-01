import path from "path";
import { isAbsolutePath, isRelativePath, normalizePath } from "./path";

export const isModule = (url: string): boolean => {
  return /^~([\da-z]|@).+/i.test(url);
};

export const getUrlOfPartial = (url: string): string => {
  const parsedUrl = path.parse(url);
  return `${normalizePath(parsedUrl.dir)}/_${parsedUrl.base}`;
};

export const normalizeUrl = (url: string): string => {
  if (isAbsolutePath(url) || isRelativePath(url) || isModule(url)) return normalizePath(url);
  return `./${normalizePath(url)}`;
};
