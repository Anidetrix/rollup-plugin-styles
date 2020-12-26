import resolveAsync, { AsyncOpts } from "resolve";

export default async (id: string, options: AsyncOpts = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- always present if there is no error
    resolveAsync(id, options, (err, res) => (err ? reject(err) : resolve(res!)));
  });
