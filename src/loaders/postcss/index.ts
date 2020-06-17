import path from "path";
import { RawSourceMap } from "source-map";
import { makeLegalIdentifier } from "@rollup/pluginutils";
import postcss from "postcss";
import cssnano from "cssnano";
import { PostCSSLoaderOptions } from "../../types";
import { humanlizePath, normalizePath } from "../../utils/path";
import { mm } from "../../utils/sourcemap";
import resolveAsync from "../../utils/resolve-async";
import safeId from "../../utils/safe-id";
import { Loader } from "../types";
import loadConfig from "./config";
import postcssImport from "./import";
import postcssUrl from "./url";
import postcssModules from "./modules";
import postcssICSS from "./icss";
import postcssNoop from "./noop";

let injectorId: string;
const testing = process.env.NODE_ENV === "test";
const reservedWords = ["css"];

function getClassNameDefault(name: string): string {
  const id = makeLegalIdentifier(name);
  if (reservedWords.includes(id)) return `_${id}`;
  return id;
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
    const modulesExports: Record<string, string> = {};

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
          generateScopedName: testing ? "[name]_[local]" : undefined,
          failOnWrongOrder: true,
          ...modulesOptions,
        }),
        postcssICSS({ extensions: options.extensions }),
      );
    }

    if (options.minimize)
      plugins.push(cssnano(typeof options.minimize === "object" ? options.minimize : {}));

    // Avoid PostCSS warning
    if (plugins.length === 0) plugins.push(postcssNoop);

    const res = await postcss(plugins).process(code, postcssOpts);

    for (const msg of res.messages)
      switch (msg.type) {
        case "warning":
          this.warn({ name: msg.plugin, message: msg.text as string });
          break;

        case "icss":
          Object.assign(modulesExports, msg.export as Record<string, string>);
          break;

        case "dependency":
          this.deps.add(normalizePath(msg.file));
          break;

        case "asset":
          this.assets.set(msg.to, msg.source);
          break;
      }

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
      `const ${modulesVarName} = ${JSON.stringify(modulesExports)}`,
      `export const css = ${cssVarName}`,
      `export default ${supportModules ? modulesVarName : cssVarName}`,
    ];

    if (options.namedExports) {
      const getClassName =
        typeof options.namedExports === "function" ? options.namedExports : getClassNameDefault;

      for (const name in modulesExports) {
        const newName = getClassName(name);

        if (name !== newName)
          this.warn(`Exported \`${name}\` as \`${newName}\` in ${humanlizePath(this.id)}`);

        if (!modulesExports[newName]) modulesExports[newName] = modulesExports[name];

        output.push(`export const ${newName} = ${JSON.stringify(modulesExports[name])}`);
      }
    }

    if (options.extract) extracted = { id: this.id, css: res.css, map };

    if (options.inject) {
      if (typeof options.inject === "function") {
        output.push(options.inject(cssVarName, this.id));
      } else {
        const injectorVarName = saferId("injector");

        if (!injectorId) {
          injectorId = await resolveAsync("./inject-css", {
            basedir: path.join(testing ? process.cwd() : __dirname, "runtime"),
          }).then(normalizePath);
        }

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
