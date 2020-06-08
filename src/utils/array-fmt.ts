export default (arr: string[]): string =>
  arr
    .map((id, i, arr) => {
      const fmt = `\`${id}\``;
      switch (i) {
        case arr.length - 1:
          return `or ${fmt}`;
        case arr.length - 2:
          return fmt;
        default:
          return `${fmt},`;
      }
    })
    .join(" ");
