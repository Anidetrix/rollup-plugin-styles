import path from "path";
import { Parser, Syntax, Stringifier, AcceptedPlugin, PluginCreator } from "postcss";
import { cosmiconfig } from "cosmiconfig";
import { PostCSSConfigLoaderOptions } from "../../types";
import { ensurePCSSPlugins, ensurePCSSOption } from "../../utils/options";

interface Options {
  parser?: Parser;
  syntax?: Syntax;
  stringifier?: Stringifier;
}

interface Config extends Options {
  plugins?: Record<string, Record<string, unknown>> | (string | PluginCreator<unknown>)[];
}

interface Result {
  plugins: AcceptedPlugin[];
  options: Options;
}

export default async function (
  id: string,
  config: false | PostCSSConfigLoaderOptions,
): Promise<Result> {
  if (!config) return { plugins: [], options: {} };

  const { ext, dir, base } = path.parse(id);

  type Found = { config: Config | ((ctx: Record<string, unknown>) => Config); isEmpty?: boolean };
  const searchPath = config.path ? path.resolve(config.path) : dir;
  const found: Found | null = await cosmiconfig("postcss").search(searchPath);

  if (!found || found.isEmpty) return { plugins: [], options: {} };

  const { plugins, parser, syntax, stringifier } =
    typeof found.config === "function"
      ? found.config({
          cwd: process.cwd(),
          env: process.env["NODE_ENV"] ?? "development",
          file: { extname: ext, dirname: dir, basename: base },
          options: config.ctx ?? {},
        })
      : found.config;

  const result: Result = { plugins: ensurePCSSPlugins(plugins), options: {} };
  if (parser) result.options.parser = ensurePCSSOption(parser, "parser");
  if (syntax) result.options.syntax = ensurePCSSOption(syntax, "syntax");
  if (stringifier) result.options.stringifier = ensurePCSSOption(stringifier, "stringifier");

  return result;
}
