import { PluginCreator } from "postcss";
const name = "styles-noop";
const plugin: PluginCreator<unknown> = () => ({ postcssPlugin: name });
plugin.postcss = true;
export default plugin;
