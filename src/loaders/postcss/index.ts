import path from "path";
import { RawSourceMap } from "source-map";
import { makeLegalIdentifier } from "@rollup/pluginutils";
import postcss from "postcss";
import postcssrc from "postcss-load-config";
import cssnano from "cssnano";
import { PostCSSLoaderOptions } from "../../types";
import { humanlizePath, normalizePath } from "../../utils/path";
import { mm } from "../../utils/sourcemap";
import resolveAsync from "../../utils/resolve-async";
import safeId from "../../utils/safe-id";
import { Loader } from "../types";
import postcssImport from "./import";
import postcssUrl from "./url";
import postcssModules from "./modules";
import postcssICSS from "./icss";
import postcssNoop from "./noop";

let injectorId: string;
const reservedWords = ["css"];
function getClassNameDefault(name: string): string {
  const id = makeLegalIdentifier(name);
  if (reservedWords.includes(id)) return `_${id}`;
  return id;
}

type LoadedConfig = ReturnType<typeof postcssrc> extends PromiseLike<infer T> ? T : never;
async function loadConfig(
  id: string,
  config: PostCSSLoaderOptions["config"],
): Promise<Partial<LoadedConfig>> {
  const configPath =
    typeof config === "object" && config.path ? path.resolve(config.path) : path.dirname(id);

  const context: Record<string, Record<string, unknown>> = {
    file: {
      extname: path.extname(id),
      dirname: path.dirname(id),
      basename: path.basename(id),
    },
    options: typeof config === "object" ? config.ctx ?? {} : {},
  };

  return postcssrc(context, configPath).catch(error => {
    if (!/no postcss config found/i.test((error as Error).message)) throw error;
    return {};
  });
}

function ensureAutoModules(am: PostCSSLoaderOptions["autoModules"], id: string): boolean {
  if (typeof am === "function") return am(id);
  if (am instanceof RegExp) return am.test(id);
  return am && /\.module\.[A-Za-z]+$/.test(id);
}

type PostCSSOptions = PostCSSLoaderOptions["postcss"] &
  Pick<Required<postcss.ProcessOptions>, "from" | "to" | "map">;

const loader: Loader<PostCSSLoaderOptions> = {
  name: "postcss",
  alwaysProcess: true,
  async process({ code, map, extracted }) {
    const options = { ...this.options };
    const config = await loadConfig(this.id, options.config);
    const plugins: (postcss.Transformer | postcss.Processor)[] = [];
    const autoModules = ensureAutoModules(options.autoModules, this.id);
    const supportModules = Boolean(options.modules || autoModules);
    const modulesExports: Record<string, Record<string, string>> = {};

    const postcssOpts: PostCSSOptions = {
      ...config.options,
      ...options.postcss,
      from: this.id,
      to: options.to ?? this.id,
      map: {
        inline: false,
        annotation: false,
        sourcesContent: this.sourceMap ? this.sourceMap.content : true,
        prev: mm(map).relative(path.dirname(this.id)).toObject(),
      },
    };

    delete postcssOpts.plugins;

    if (options.import)
      plugins.push(postcssImport({ extensions: options.extensions, ...options.import }));

    if (options.url) plugins.push(postcssUrl({ inline: Boolean(options.inject), ...options.url }));

    if (options.postcss.plugins) plugins.push(...options.postcss.plugins);

    if (config.plugins) plugins.push(...config.plugins);

    if (supportModules) {
      const modulesOptions = typeof options.modules === "object" ? options.modules : {};
      plugins.push(
        ...postcssModules({
          generateScopedName: process.env.NODE_ENV === "test" ? "[name]_[local]" : undefined,
          failOnWrongOrder: true,
          ...modulesOptions,
        }),
        postcssICSS({
          extensions: options.extensions,
          getReplacements(file, replacements, out) {
            modulesExports[file] = replacements;
            if (
              typeof options.modules === "object" &&
              typeof options.modules.getReplacements === "function"
            ) {
              return options.modules.getReplacements(file, replacements, out);
            }
          },
        }),
      );
    }

    if (options.minimize)
      plugins.push(cssnano(typeof options.minimize === "object" ? options.minimize : {}));

    // Avoid PostCSS warning
    if (plugins.length === 0) plugins.push(postcssNoop);

    const res = await postcss(plugins).process(code, postcssOpts);

    for (const warning of res.warnings())
      this.warn({ name: warning.plugin, message: warning.text });

    const deps = res.messages.filter(msg => msg.type === "dependency");
    for (const dep of deps) this.deps.add(normalizePath(dep.file));

    const assets = res.messages.filter(msg => msg.type === "asset");
    for (const asset of assets) this.assets.set(asset.to, asset.source);

    map = mm((res.map?.toJSON() as unknown) as RawSourceMap)
      .resolve(path.dirname(postcssOpts.to))
      .toString();

    if (!options.extract && this.sourceMap)
      res.css += mm(map)
        .modify(map => void delete map.file)
        .relative()
        .toCommentData();

    if (options.emit) return { code: res.css, map };

    const saferId = (id: string): string => safeId(id, humanlizePath(this.id));
    const cssVarName = saferId("css");
    const modulesVarName = saferId("modules");

    const output = [
      `const ${cssVarName} = ${JSON.stringify(res.css)}`,
      `const ${modulesVarName} = ${JSON.stringify(modulesExports[this.id] ?? {})}`,
      `export const css = ${cssVarName}`,
      `export default ${supportModules ? modulesVarName : cssVarName}`,
    ];

    if (options.namedExports) {
      const json = modulesExports[this.id];

      const getClassName =
        typeof options.namedExports === "function" ? options.namedExports : getClassNameDefault;

      for (const name in json) {
        const newName = getClassName(name);

        if (name !== newName)
          this.warn(`Exported \`${name}\` as \`${newName}\` in ${humanlizePath(this.id)}`);

        if (!json[newName]) json[newName] = json[name];

        output.push(`export const ${newName} = ${JSON.stringify(json[name])}`);
      }
    }

    if (options.extract) extracted = { id: this.id, css: res.css, map };

    if (options.inject) {
      if (typeof options.inject === "function") {
        output.push(options.inject(cssVarName, this.id));
      } else {
        const injectorVarName = saferId("injector");

        if (!injectorId)
          injectorId = await resolveAsync("./inject-css", {
            basedir: path.join(
              process.env.NODE_ENV === "test" ? process.cwd() : __dirname,
              "runtime",
            ),
          }).then(normalizePath);

        const injectorData =
          typeof options.inject === "object" ? `,${JSON.stringify(options.inject)}` : "";

        output.push(
          `import ${injectorVarName} from '${injectorId}'`,
          `${injectorVarName}(${cssVarName}${injectorData})`,
        );
      }
    }

    code = `${output.join(";\n")};`;

    return { code, map, extracted };
  },
};

export default loader;
