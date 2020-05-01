import path from "path";

export const isAbsolutePath = (path: string): boolean => /^(?:\/|(?:[A-Za-z]:)?[/\\|])/.test(path);

export const isRelativePath = (path: string): boolean => /^\.?\.[/\\]/.test(path);

export const normalizePath = (...paths: string[]): string => {
  const f = path.normalize(path.join(...paths)).replace(/\\/g, "/");
  if (/^\.[/\\]/.test(paths[0])) return `./${f}`;
  return f;
};

export const resolvePath = (...paths: string[]): string => normalizePath(path.resolve(...paths));

export const relativePath = (dir: string, file: string): string =>
  normalizePath(path.relative(dir, file));

export const humanlizePath = (file: string): string => relativePath(process.cwd(), file);
