import path from "path";

/**
 * @param {string} file File path
 * @returns {string} Normalized path
 */
export function normalizePath(file: string): string {
  return file.replace(/\\/g, "/");
}

/**
 * @param {string} dir Directory path
 * @param {string} file File path
 * @returns {string} Normalized path, relative to `dir`
 */
export function relativePath(dir: string, file: string): string {
  return normalizePath(path.relative(dir, file));
}

/**
 * @param {string} file File path
 * @returns {string} Normalized path, relative to current working directory
 */
export function humanlizePath(file: string): string {
  return relativePath(process.cwd(), file);
}

/**
 * @param {string} path Path
 * @returns {boolean} `true` if `path` is absolute, otherwise `false`
 */
export function isAbsolutePath(path: string): boolean {
  return /^(?:\/|(?:[A-Za-z]:)?[/\\|])/.test(path);
}

/**
 * @param {string} path Path
 * @returns {boolean} `true` if `path` is relative, otherwise `false`
 */
export function isRelativePath(path: string): boolean {
  return /^\.?\.\//.test(path);
}
