import resolveAsync, { AsyncOpts } from "resolve";

export default async (id: string, options: AsyncOpts = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    resolveAsync(id, options, (err, res) => (err ? reject(err) : resolve(res)));
  });
