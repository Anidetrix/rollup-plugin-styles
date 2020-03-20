import path from "path";

export const moduleRe = /^~([\da-z]|@).+/i;

export const getUrlOfPartial = (url: string): string => {
  const parsedUrl = path.parse(url);
  return `${parsedUrl.dir}${path.sep}_${parsedUrl.base}`;
};
