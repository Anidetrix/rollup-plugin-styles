// https://github.com/microsoft/TypeScript/issues/24063
export default <T>(v: T): v is Exclude<T, false | null | undefined | 0 | ""> => !!v;
