import path from "path";
import fs from "fs-extra";
import { RawSourceMap } from "source-map";
import { makeLegalIdentifier } from "@rollup/pluginutils";
import postcss from "postcss";
import cssnano from "cssnano";
import { PostCSSLoaderOptions, InjectOptions } from "../../types";
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

const cssVarName = "css";
const reservedWords = [cssVarName];

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

    const saferId = (id: string): string => safeId(id, path.basename(this.id));
    const modulesVarName = saferId("modules");

    const output = [`export var ${cssVarName} = ${JSON.stringify(res.css)};`];
    const dts = [`export var ${cssVarName}: string;`];

    if (options.namedExports) {
      const getClassName =
        typeof options.namedExports === "function" ? options.namedExports : getClassNameDefault;

      for (const name in modulesExports) {
        const newName = getClassName(name);

        if (name !== newName)
          this.warn(`Exported \`${name}\` as \`${newName}\` in ${humanlizePath(this.id)}`);

        const fmt = JSON.stringify(modulesExports[name]);
        output.push(`export var ${newName} = ${fmt};`);
        if (options.dts) dts.push(`export var ${newName}: ${fmt};`);
      }
    }

    if (options.extract) extracted = { id: this.id, css: res.css, map };

    if (options.inject) {
      if (typeof options.inject === "function") {
        output.push(options.inject(cssVarName, this.id));
        output.push(`var ${modulesVarName} = ${JSON.stringify(modulesExports)};`);
      } else {
        const { treeshakeable, ...injectorOptions } =
          typeof options.inject === "object" ? options.inject : ({} as InjectOptions);

        const injectorName = saferId("injector");
        const injectorCall = `${injectorName}(${cssVarName},${JSON.stringify(injectorOptions)});`;

        if (!injectorId) {
          injectorId = await resolveAsync("./inject-css", {
            basedir: path.join(testing ? process.cwd() : __dirname, "runtime"),
          })
            .then(normalizePath)
            .then(JSON.stringify);
        }

        output.push(`import ${injectorName} from ${injectorId};`);

        if (!treeshakeable)
          output.push(`var ${modulesVarName} = ${JSON.stringify(modulesExports)};`, injectorCall);

        if (treeshakeable) {
          output.push("var injected = false;");
          const injectorCallOnce = `if (!injected) { injected = true; ${injectorCall} }`;

          if (modulesExports.inject) {
            throw new Error(
              "`inject` keyword is reserved when using `inject.treeshakeable` option",
            );
          }

          let getters = "";
          for (const [k, v] of Object.entries(modulesExports)) {
            const name = JSON.stringify(k);
            const value = JSON.stringify(v);
            getters += `get ${name}() { ${injectorCallOnce} return ${value}; },\n`;
          }

          getters += `inject() { ${injectorCallOnce} },`;
          output.push(`var ${modulesVarName} = {${getters}};`);
        }
      }
    }

    if (!options.inject) output.push(`var ${modulesVarName} = ${JSON.stringify(modulesExports)};`);

    const defaultExport = `export default ${supportModules ? modulesVarName : cssVarName};`;
    output.push(defaultExport);

    if (options.dts && (await fs.pathExists(this.id))) {
      if (supportModules)
        dts.push(
          `interface ModulesExports ${JSON.stringify(modulesExports)}`,

          typeof options.inject === "object" && options.inject.treeshakeable
            ? `interface ModulesExports {inject:()=>void}`
            : "",

          `declare const ${modulesVarName}: ModulesExports;`,
        );

      dts.push(defaultExport);
      await fs.writeFile(`${this.id}.d.ts`, dts.filter(Boolean).join("\n"));
    }

    return { code: output.filter(Boolean).join("\n"), map, extracted };
  },
};

export default loader;
