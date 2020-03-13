import { default as nodeResolve, AsyncOpts } from "resolve";

export default (id: string, options: AsyncOpts = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    nodeResolve(id, options, (err, res) => (err ? reject(err) : resolve(res)));
  });
