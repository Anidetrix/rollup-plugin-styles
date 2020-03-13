export const mapValueAsync = <V>(
  o: { [k: string]: V },
  f: (v: V) => Promise<V> | V,
): Promise<{ [k: string]: V }> =>
  Object.entries(o).reduce(async (result, [k, v]) => {
    const next = await result;
    next[k] = await f(v);
    return next;
  }, Promise.resolve({} as typeof o));
