export default <T>(tasks: ((...args: T[]) => Promise<T>)[], initial: T): Promise<T> =>
  tasks.reduce((current, next) => current.then(next), Promise.resolve(initial));
