import { cpus } from "os";
import PQueue from "p-queue";

import { Loader, Payload, LoaderContext, ObjectWithUnknownProps, LoadersOptions } from "../types";
import postcssLoader from "./postcss";
import sourcemapLoader from "./sourcemap";
import sassLoader from "./sass";
import stylusLoader from "./stylus";
import lessLoader from "./less";

/**
 * @param filepath File path
 * @param condition Condition to check againts
 * @returns `true` if `filepath` matches `condition`, otherwise `false`
 */
function matchFile(filepath: string, condition: Loader["test"]): boolean {
  if (typeof condition === "function") return condition(filepath);
  return !!condition && condition.test(filepath);
}

// This queue makes sure one thread is always available,
// which is necessary for some cases
// ex.: https://github.com/sass/node-sass/issues/857
const threadPoolSize = process.env.UV_THREADPOOL_SIZE
  ? Number.parseInt(process.env.UV_THREADPOOL_SIZE)
  : cpus().length;
const workQueue = new PQueue({ concurrency: threadPoolSize - 1 });

export default class Loaders {
  use: [string, ObjectWithUnknownProps][] = [];
  loaders: Loader<any>[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(options: LoadersOptions) {
    if (options.use) {
      this.use = options.use.map(rule => {
        if (typeof rule === "string") return [rule, {}];
        if (Array.isArray(rule)) return rule.length === 1 ? [rule[0], {}] : rule;
        throw new TypeError("The rule in `use` option must be string or array!");
      });
    }

    postcssLoader.test = (filepath): boolean =>
      options.extensions.some(ext => filepath.toLowerCase().endsWith(ext));

    this.listLoader(postcssLoader);
    this.listLoader(sourcemapLoader);
    this.listLoader(sassLoader);
    this.listLoader(stylusLoader);
    this.listLoader(lessLoader);
    if (options.loaders) options.loaders.forEach(loader => this.listLoader(loader));
  }

  getLoader(name: string): Loader | undefined {
    return this.loaders.find(loader => loader.name === name);
  }

  listLoader<T>(loader: Loader<T>): void {
    const existing = this.getLoader(loader.name);
    if (existing) this.unlistLoader(loader.name);
    this.loaders.push(loader);
  }

  unlistLoader(name: string): void {
    this.loaders = this.loaders.filter(loader => loader.name !== name);
  }

  isSupported(filepath: string): boolean {
    return this.loaders.some(loader => matchFile(filepath, loader.test));
  }

  process(payload: Payload, context: LoaderContext): Promise<Payload> {
    return this.use
      .slice()
      .reverse()
      .map(([name, options]) => {
        const loader = this.getLoader(name);
        const loaderContext: LoaderContext = { ...context, options: options || {} };

        return async (payload: Payload): Promise<Payload> => {
          if (loader && (loader.alwaysProcess || matchFile(loaderContext.id, loader.test))) {
            return workQueue.add(loader.process.bind(loaderContext, payload));
          }

          // Otherwise directly return input value
          return payload;
        };
      })
      .reduce((current, next) => current.then(next), Promise.resolve({ ...payload }));
  }
}
