module.exports = api => {
  api.cache.invalidate(() => process.env.NODE_ENV === "production");

  const presets = [["@babel/preset-env", { modules: false, targets: { node: "12" } }]];
  const plugins = ["@babel/plugin-proposal-class-properties"];

  if (api.env("test")) presets[0][1].modules = "commonjs";

  return { presets, plugins };
};
