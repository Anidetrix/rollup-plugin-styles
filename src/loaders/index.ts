import PQueue from "p-queue";

import { Loader, LoaderContext, LoadersOptions, ObjectWithUnknownProps, Payload } from "../types";
import postcssLoader from "./postcss";
import sourcemapLoader from "./sourcemap";
import sassLoader from "./sass";
import stylusLoader from "./stylus";
import lessLoader from "./less";

function matchFile(filepath: string, condition: Loader["test"]): boolean {
  if (typeof condition === "function") return condition(filepath);
  return Boolean(condition?.test(filepath));
}

// This queue makes sure one thread is always available,
// which is necessary for some cases
// ex.: https://github.com/sass/node-sass/issues/857
const threadPoolSize = process.env.UV_THREADPOOL_SIZE
  ? Number.parseInt(process.env.UV_THREADPOOL_SIZE)
  : 4; // default `libuv` threadpool size
const workQueue = new PQueue({ concurrency: threadPoolSize - 1 });

export default class Loaders {
  loaders: Loader[] = [];
  use: [string, ObjectWithUnknownProps][];
  test: (filepath: string) => boolean;

  constructor(options: LoadersOptions) {
    this.use = options.use.map(rule => {
      if (typeof rule === "string") return [rule, {}];
      if (Array.isArray(rule)) return rule.length === 1 ? [rule[0], {}] : rule;
      throw new TypeError("The rule in `use` option must be string or array!");
    });

    this.test = (filepath): boolean =>
      options.extensions.some(ext => filepath.toLowerCase().endsWith(ext));

    this.listLoader(postcssLoader);
    this.listLoader(sourcemapLoader);
    this.listLoader(sassLoader);
    this.listLoader(stylusLoader);
    this.listLoader(lessLoader);
    for (const loader of options.loaders) this.listLoader(loader);
  }

  getLoader(name: string): Loader | undefined {
    return this.loaders.find(loader => loader.name === name);
  }

  listLoader<T extends ObjectWithUnknownProps>(loader: Loader<T>): void {
    if (!this.use.some(rule => rule[0] === loader.name)) return;
    if (this.getLoader(loader.name)) this.unlistLoader(loader.name);
    this.loaders.push(loader as Loader);
  }

  unlistLoader(name: string): void {
    this.loaders = this.loaders.filter(loader => loader.name !== name);
  }

  isSupported(filepath: string): boolean {
    return this.test(filepath) || this.loaders.some(loader => matchFile(filepath, loader.test));
  }

  async process(payload: Payload, context: LoaderContext): Promise<Payload> {
    return this.use
      .slice()
      .reverse()
      .map(([name, options]) => {
        const loader = this.getLoader(name);
        const ctx: LoaderContext = { ...context, options: options ?? {} };

        return async (payload: Payload): Promise<Payload> => {
          if (loader && (loader.alwaysProcess || matchFile(ctx.id, loader.test))) {
            return workQueue.add(loader.process.bind(ctx, payload));
          }

          return payload;
        };
      })
      .reduce(async (current, next) => current.then(next), Promise.resolve({ ...payload }));
  }
}
