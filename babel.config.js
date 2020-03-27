module.exports = api => {
  api.cache.invalidate(() => process.env.NODE_ENV === "production");

  const presets = [["@babel/preset-env", { targets: { node: "10" } }]];
  const plugins = [["@babel/plugin-transform-runtime", { useESModules: true }]];

  if (api.env("test")) presets[0][1].modules = "commonjs";

  return { presets, plugins };
};
