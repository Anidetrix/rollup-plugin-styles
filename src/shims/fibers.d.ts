declare namespace fibers {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class Fiber {}
}

declare module "fibers" {
  const fiber: fibers.Fiber;
  export = fiber;
}
