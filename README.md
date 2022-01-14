# rollup-plugin-styles

[![npm version](https://img.shields.io/npm/v/rollup-plugin-styles)](https://www.npmjs.com/package/rollup-plugin-styles)
[![monthly downloads count](https://img.shields.io/npm/dm/rollup-plugin-styles)](https://www.npmjs.com/package/rollup-plugin-styles)
[![required rollup version](https://img.shields.io/npm/dependency-version/rollup-plugin-styles/peer/rollup)](https://www.npmjs.com/package/rollup)
[![build status](https://github.com/Anidetrix/rollup-plugin-styles/workflows/CI/badge.svg)](https://github.com/Anidetrix/rollup-plugin-styles/actions?query=workflow%3ACI)
[![code coverage](https://codecov.io/gh/Anidetrix/rollup-plugin-styles/branch/main/graph/badge.svg)](https://codecov.io/gh/Anidetrix/rollup-plugin-styles)
[![license](https://img.shields.io/github/license/Anidetrix/rollup-plugin-styles)](./LICENSE)
[![financial contributors](https://opencollective.com/rollup-plugin-styles/tiers/badge.svg)](https://opencollective.com/rollup-plugin-styles)

### 🎨 Universal [Rollup](https://github.com/rollup/rollup) plugin for styles:

- [PostCSS](https://github.com/postcss/postcss)
- [Sass](https://github.com/sass/dart-sass)
- [Less](https://github.com/less/less.js)
- [Stylus](https://github.com/stylus/stylus)
- [CSS Modules](https://github.com/css-modules/css-modules)
- URL resolving/rewriting with asset handling
- Ability to use `@import` statements inside regular CSS

...and more!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing a file](#importing-a-file)
    - [CSS/Stylus](#cssstylus)
    - [Sass/Less](#sassless)
  - [CSS Injection](#css-injection)
  - [CSS Extraction](#css-extraction)
  - [Emitting processed CSS](#emitting-processed-css)
  - [CSS Modules](#css-modules)
  - [With Sass/Less/Stylus](#with-sasslessstylus)
- [Configuration](#configuration)
- [Why](#why)
- [License](#license)
- [Thanks](#thanks)

## Installation

```bash
# npm
npm install -D rollup-plugin-styles
# pnpm
pnpm add -D rollup-plugin-styles
# yarn
yarn add rollup-plugin-styles --dev
```

## Usage

```js
// rollup.config.js
import styles from "rollup-plugin-styles";

export default {
  output: {
    // Governs names of CSS files (for assets from CSS use `hash` option for url handler).
    // Note: using value below will put `.css` files near js,
    // but make sure to adjust `hash`, `assetDir` and `publicPath`
    // options for url handler accordingly.
    assetFileNames: "[name]-[hash][extname]",
  },
  plugins: [styles()],
};
```

After that you can import CSS files in your code:

```js
import "./style.css";
```

Default mode is `inject`, which means CSS is embedded inside JS and injected into `<head>` at runtime, with ability to pass options to CSS injector or even pass your own injector.

CSS is available as default export in `inject` and `extract` modes, but if [CSS Modules](https://github.com/css-modules/css-modules) are enabled you need to use named `css` export.

```js
// Injects CSS, also available as `style` in this example
import style from "./style.css";
// Using named export of CSS string
import { css } from "./style.css";
```

In `emit` mode none of the exports are available as CSS is purely processed and passed along the build pipeline, which is useful if you want to preprocess CSS before using it with CSS consuming plugins, e.g. [rollup-plugin-lit-css](https://github.com/bennypowers/rollup-plugin-lit-css).

PostCSS configuration files will be found and loaded automatically, but this behavior is configurable using `config` option.

### Importing a file

#### CSS/Stylus

```css
/* Import from `node_modules` */
@import "bulma/css/bulma";
/* Local import */
@import "./custom";
/* ...or (if no package named `custom` in `node_modules`) */
@import "custom";
```

#### Sass/Less

You can prepend the path with `~` to resolve in `node_modules`:

```scss
// Import from `node_modules`
@import "~bulma/css/bulma";
// Local import
@import "./custom";
// ...or
@import "custom";
```

Also note that partials are considered first, e.g.

```scss
@import "custom";
```

Will look for `_custom` first (_with the approptiate extension(s)_), and then for `custom` if `_custom` doesn't exist.

### CSS Injection

```js
styles({
  mode: "inject", // Unnecessary, set by default
  // ...or with custom options for injector
  mode: [
    "inject",
    { container: "body", singleTag: true, prepend: true, attributes: { id: "global" } },
  ],
  // ...or with custom injector
  mode: ["inject", (varname, id) => `console.log(${varname},${JSON.stringify(id)})`],
});
```

### CSS Extraction

```js
styles({
  mode: "extract",
  // ... or with relative to output dir/output file's basedir (but not outside of it)
  mode: ["extract", "awesome-bundle.css"],
});
```

### Emitting processed CSS

```js
// rollup.config.js
import styles from "rollup-plugin-styles";

// Any plugin which consumes pure CSS
import litcss from "rollup-plugin-lit-css";

export default {
  plugins: [
    styles({ mode: "emit" }),

    // Make sure to list it after this one
    litcss(),
  ],
};
```

### [CSS Modules](https://github.com/css-modules/css-modules)

```js
styles({
  modules: true,
  // ...or with custom options
  modules: {},
  // ...additionally using autoModules
  autoModules: true,
  // ...with custom regex
  autoModules: /\.mod\.\S+$/,
  // ...or custom function
  autoModules: id => id.includes(".modular."),
});
```

### With Sass/Less/Stylus

Install corresponding dependency:

- For `Sass` support install `node-sass` or `sass`:

  ```bash
  # npm
  npm install -D node-sass
  # pnpm
  pnpm add -D node-sass
  # yarn
  yarn add node-sass --dev
  ```

  ```bash
  # npm
  npm install -D sass
  # pnpm
  pnpm add -D sass
  # yarn
  yarn add sass --dev
  ```

- For `Less` support install `less`:

  ```bash
  # npm
  npm install -D less
  # pnpm
  pnpm add -D less
  # yarn
  yarn add less --dev
  ```

- For `Stylus` support install `stylus`:

  ```bash
  # npm
  npm install -D stylus
  # pnpm
  pnpm add -D stylus
  # yarn
  yarn add stylus --dev
  ```

That's it, now you can import `.scss` `.sass` `.less` `.styl` `.stylus` files in your code.

## Configuration

See [API Reference for `Options`](https://anidetrix.github.io/rollup-plugin-styles/interfaces/types.options.html) for full list of available options.

## Why

Because alternatives did not look good enough - they are either too basic, too buggy or poorly maintained.

For example, the main alternative (and inspiration) is [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss), but at the time it is not actively maintained, has a bunch of critical bugs and subjectively lacks some useful features and quality of life improvements which should be a part of it.

With that said, here is the basic list of things which differentiate this plugin from the aforementioned one:

- Written completely in TypeScript
- Up-to-date [CSS Modules](https://github.com/css-modules/css-modules) implementation
- Built-in `@import` handler
- Built-in assets handler
- Ability to emit pure CSS for other plugins
- Complete code splitting support, with respect for multiple entries, `preserveModules` and `manualChunks`
- Multiple instances support, with check for already processed files
- Proper sourcemaps, with included sources content by default
- Respects `assetFileNames` for CSS file names
- Respects sourcemaps from loaded files
- Support for implementation forcing for Sass
- Support for partials and `~` in Less import statements
- More smaller things that I forgot

## License

MIT &copy; [Anton Kudryavtsev](https://github.com/Anidetrix)

## Thanks

- [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss) - for good reference 👍
- [rollup](https://github.com/rollup/rollup) - for awesome bundler 😎
