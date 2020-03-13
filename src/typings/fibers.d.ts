declare module "fibers" {
  export interface FiberConstructor {
    new (fn: Function): Fiber;
    (fn: Function): Fiber;
  }

  export interface Fiber {
    run<T = unknown, R = unknown>(param?: T): R;
    reset<T = unknown>(): T;
    throwInto(exception: Error): void;
  }

  const Fiber: FiberConstructor;
  export default Fiber;
}
