import path from "path";
import { RawSourceMap } from "source-map";
import { makeLegalIdentifier } from "@rollup/pluginutils";
import postcss from "postcss";
import loadPostCSSConfig from "postcss-load-config";
import cssnano from "cssnano";

import { Loader, PostCSSLoaderOptions } from "../../types";
import { humanlizePath, normalizePath } from "../../utils/path";
import { mm } from "../../utils/sourcemap";
import resolveAsync from "../../utils/resolve-async";
import safeId from "../../utils/safe-id";
import { denullifyObject, booleanFilter } from "../../utils/filter";

import postcssImport from "./import";
import postcssUrl from "./url";
import postcssModules from "./modules";
import postcssICSS from "./icss";
import postcssNoop from "./noop";

type LoadedConfig = ReturnType<typeof loadPostCSSConfig> extends PromiseLike<infer T> ? T : never;

/**
 * @param id File path
 * @param config `postcss-load-config`'s options
 * @returns Loaded PostCSS config
 */
async function loadConfig(
  id: string,
  config: PostCSSLoaderOptions["config"],
): Promise<Partial<LoadedConfig>> {
  const configPath =
    typeof config === "object" && config.path ? path.resolve(config.path) : path.dirname(id);

  const context: { [prop: string]: object | string } = {
    file: {
      extname: path.extname(id),
      dirname: path.dirname(id),
      basename: path.basename(id),
    },
    options: typeof config === "object" ? config.ctx ?? {} : {},
  };

  return loadPostCSSConfig(context, configPath).catch(error => {
    if (!(error.message as string).toLowerCase().includes("no postcss config found")) throw error;
    return {};
  });
}

const loader: Loader<PostCSSLoaderOptions> = {
  name: "postcss",
  alwaysProcess: true,
  async process({ code, map, extracted }) {
    const { options } = this;

    const config = await loadConfig(this.id, options.config);

    const plugins = [
      ...[
        options.import && postcssImport({ extensions: options.extensions, ...options.import }),
        options.url && postcssUrl(options.url),
      ].filter(booleanFilter),
      ...(options.postcss.plugins ?? []),
      ...(config.plugins ?? []),
    ];

    const autoModules =
      options.autoModules &&
      (typeof options.autoModules === "function"
        ? options.autoModules(this.id)
        : options.autoModules instanceof RegExp
        ? options.autoModules.test(this.id)
        : /\.module\.[A-Za-z]+$/.test(this.id));

    const supportModules = Boolean(options.modules || autoModules);

    const modulesExports: { [filepath: string]: { [prop: string]: string } } = {};

    const postcssOpts: PostCSSLoaderOptions["postcss"] & {
      from: string;
      to: string;
      map: postcss.ProcessOptions["map"];
    } = {
      ...denullifyObject((config.options ?? {}) as Required<postcss.ProcessOptions>),
      ...denullifyObject(options.postcss),
      from: this.id,
      to: options.to ?? this.id,
      map: {
        inline: false,
        annotation: false,
        sourcesContent: true,
        prev: mm(map).relative(path.dirname(this.id)).toObject(),
      },
    };

    delete postcssOpts.plugins;

    if (supportModules) {
      const modulesOptions = typeof options.modules === "object" ? options.modules : {};
      plugins.push(
        ...postcssModules({
          // Skip hash while testing since CSS content would differ on Windows and Linux
          // due to different line endings.
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

    const reservedWords = new Set<string>();
    const saferId = (id: string): string => safeId(id, humanlizePath(this.id));

    const cssExportName = "css";
    reservedWords.add(cssExportName);

    const cssVarName = saferId(cssExportName);
    const modulesVarName = saferId("modules");

    const output = [
      `const ${cssVarName} = ${JSON.stringify(res.css)}`,
      `const ${modulesVarName} = ${JSON.stringify(modulesExports[this.id] ?? {})}`,
      `export const ${cssExportName} = ${cssVarName}`,
      `export default ${supportModules ? modulesVarName : cssVarName}`,
    ];

    if (options.namedExports) {
      const json = modulesExports[this.id];

      const getClassName =
        typeof options.namedExports === "function"
          ? options.namedExports
          : (name: string): string =>
              makeLegalIdentifier(reservedWords.has(name) ? `_${name}` : name);

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
        const injectorId = await resolveAsync("./inject-css", {
          basedir: path.join(
            process.env.NODE_ENV === "test" ? process.cwd() : __dirname,
            "runtime",
          ),
        });
        const injectorData =
          typeof options.inject === "object" ? `,${JSON.stringify(options.inject)}` : "";

        output.push(
          `import ${injectorVarName} from '${normalizePath(injectorId)}'`,
          `${injectorVarName}(${cssVarName}${injectorData})`,
        );
      }
    }

    code = `${output.join(";\n")};`;

    return { code, map, extracted };
  },
};

export default loader;
