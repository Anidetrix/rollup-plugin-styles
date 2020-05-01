export const isNullish = <T>(v: T): v is Extract<T, null | undefined> => {
  const _v = v ?? undefined;
  if (typeof _v === "undefined") return true;
  return false;
};

export const nullishFilter = <T>(v: T): v is NonNullable<T> => !isNullish(v);

export const denullifyObject = <T>(o: { [k: string]: T }): { [k: string]: NonNullable<T> } =>
  Object.entries(o)
    .filter(([, v]) => nullishFilter(v))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

export const booleanFilter = <T>(v: T): v is Exclude<T, false | null | undefined | "" | 0> =>
  Boolean(v);
