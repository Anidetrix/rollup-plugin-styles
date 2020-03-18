import path from "path";

/**
 * @param file File path
 * @returns Normalized path
 */
export function normalizePath(file: string): string {
  return file.replace(/\\/g, "/");
}

/**
 * @param paths Array of paths
 * @returns Normalized absolute path
 */
export function resolvePath(...paths: string[]): string {
  return normalizePath(path.resolve(...paths));
}

/**
 * @param dir Directory path
 * @param file File path
 * @returns Normalized path, relative to `dir`
 */
export function relativePath(dir: string, file: string): string {
  return normalizePath(path.relative(dir, file));
}

/**
 * @param file File path
 * @returns Normalized path, relative to current working directory
 */
export function humanlizePath(file: string): string {
  return relativePath(process.cwd(), file);
}

/**
 * @param path Path
 * @returns `true` if `path` is absolute, otherwise `false`
 */
export function isAbsolutePath(path: string): boolean {
  return /^(?:\/|(?:[A-Za-z]:)?[/\\|])/.test(path);
}

/**
 * @param path Path
 * @returns `true` if `path` is relative, otherwise `false`
 */
export function isRelativePath(path: string): boolean {
  return /^\.?\.\//.test(path);
}
