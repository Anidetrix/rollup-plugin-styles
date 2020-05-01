declare module "fibers" {
  export interface FiberConstructor {
    new (fn: Function): Fiber;
    (fn: Function): Fiber;
  }

  export interface Fiber {
    run<T = unknown, TR = unknown>(param?: T): TR;
    reset<T = unknown>(): T;
    throwInto(exception: Error): void;
  }

  const Fiber: FiberConstructor;
  export default Fiber;
}
