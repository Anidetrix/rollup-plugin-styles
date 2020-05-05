# rollup-plugin-styles

<a href="https://www.npmjs.com/package/rollup-plugin-styles"><img src="https://img.shields.io/npm/v/rollup-plugin-styles"/></a>
<a href="https://www.npmjs.com/package/rollup-plugin-styles"><img src="https://img.shields.io/npm/dt/rollup-plugin-styles"/></a>
<a href="https://www.npmjs.com/package/rollup"><img src="https://img.shields.io/npm/dependency-version/rollup-plugin-styles/peer/rollup"/></a>
<a href="https://david-dm.org/Anidetrix/rollup-plugin-styles"><img src="https://img.shields.io/david/Anidetrix/rollup-plugin-styles"/></a>
<a href="https://codecov.io/gh/Anidetrix/rollup-plugin-styles"><img src="https://codecov.io/gh/Anidetrix/rollup-plugin-styles/branch/master/graph/badge.svg"/></a>
<a href="./LICENSE"><img src="https://img.shields.io/github/license/Anidetrix/rollup-plugin-styles"/></a>

🎨 Universal [Rollup](https://github.com/rollup/rollup) plugin for styles: [PostCSS](https://github.com/postcss/postcss), [Sass](https://github.com/sass/dart-sass), [Less](https://github.com/less/less.js), [Stylus](https://github.com/stylus/stylus) and more.

## Install

```bash
npm install -D rollup-plugin-styles # npm

pnpm add -D rollup-plugin-styles # pnpm

yarn add rollup-plugin-styles --dev # yarn 1.x
```

## Usage

```js
// rollup.config.js
import styles from "rollup-plugin-styles";

export default {
  output: {
    // Governs names of CSS files and assets from CSS URLs
    // Recommended value shown below
    assetFileNames: "[name]-[hash][extname]",
  },
  plugins: [styles()],
};
```

After that you can import CSS files in your code:

```js
import "./style.css";
```

Default mode is `inject`, which means generated CSS will be injected into `<head>`, with ability to pass options to CSS injector or even pass your own injector

CSS is available as default export in `inject` and `extract` modes, but if [CSS Modules](https://github.com/css-modules/css-modules) are enabled you need to use named `css` export.

In `emit` mode none of the exports are available since it purely processes CSS and passes it along the build pipeline, which is useful if you only want to preprocess CSS for usage with CSS consuming plugins, i.e. [rollup-plugin-lit-css](https://github.com/bennypowers/rollup-plugin-lit-css)

```js
// Injects CSS, also available as `style` in this example
import style from "./style.css";
// Named export of CSS string
import { css } from "./style.css";
```

This plugin also automatically detects and uses local PostCSS config files.

### CSS Injection

```js
styles({
  mode: "inject", // Unnecessary, set by default
  // ...or with custom options for injector
  mode: ["inject", { container: "body", singleTag: true, prepend: true }],
  // ...or with custom injector
  mode: ["inject", yourInjectorFn],
});
```

### CSS Extraction

```js
styles({
  mode: "extract",
  // ... or with relative to output dir/output file's basedir (but not outside of it).
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
});
```

### With Sass/Stylus/Less

Install corresponding dependency:

- For `Sass` support install `node-sass` or `sass`:

  ```bash
  npm install -D node-sass # npm

  pnpm add -D node-sass # pnpm

  yarn add node-sass --dev # yarn 1.x
  ```

  ```bash
  npm install -D sass # npm

  pnpm add -D sass # pnpm

  yarn add sass --dev # yarn 1.x
  ```

- For `Stylus` support install `stylus`:

  ```bash
  npm install -D stylus # npm

  pnpm add -D stylus # pnpm

  yarn add stylus --dev # yarn 1.x
  ```

- For `Less` support install `less`:

  ```bash
  npm install -D less # npm

  pnpm add -D less # pnpm

  yarn add less --dev # yarn 1.x
  ```

That's it, now you can import `.scss` `.sass` `.styl` `.stylus` `.less` files in your code.

#### imports (**Sass/Scss/Less**)

Similar to how webpack's [sass-loader](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules) works, you can prepend the import path with `~` to tell this plugin to resolve in `node_modules`:

```scss
@import "~bulma/css/bulma";
```

#### `fibers` (**Sass/Scss only**)

This plugin will auto detect `fibers` package when using `sass` implementation

> When installed via npm, `Dart Sass` supports a JavaScript API that's fully compatible with `Node Sass` <...>, with support for both the render() and renderSync() functions. <...>
>
> Note however that by default, **renderSync() is more than twice as fast as render()** due to the overhead of asynchronous callbacks. To avoid this performance hit, render() can use the `fibers` package to call asynchronous importers from the synchronous code path.
>
> [Source](https://github.com/sass/dart-sass/blob/master/README.md#javascript-api)

To install `fibers`:

```bash
npm install -D fibers # npm

pnpm add -D fibers # pnpm

yarn add fibers --dev # yarn 1.x
```

## Configuration

See [API Reference for `Options`](https://anidetrix.github.io/rollup-plugin-styles/interfaces/options.html) for full list of available options.

## Main differences from [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)

- Written completely in TypeScript
- Up-to-date [CSS Modules](https://github.com/css-modules/css-modules) implementation
- Built-in `@import` handler
- Built-in assets handler
- Respects `output.assetFileNames`
- Code splitting support
- Ability to emit pure CSS for other plugins
- Correct multiple instance support with check for already processed files
- Support for implementation and `fibers` forcing for Sass
- Support for partials and `~` in Less import statements
- Sourcemaps include source content
- Proper sourcemap generation for all loaders
- Correct inline sourcemaps
- Correct relative source paths in extracted sourcemaps
- Extracts sourcemaps from loaded files
- More smaller things that I forgot

## Contribute

Any contributions are always welcome, not only Pull Requests! 😀

- **QA**: file bug reports, the more details you can give the better
- **Code**: take a look at the [open issues](https://github.com/Anidetrix/rollup-plugin-styles/issues), even if you can't write code showing that you care about a given issue matters
- **Ideas**: feature requests are welcome, even ambitious ones

Your First Contribution? You can learn how from this _free_ series, [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

## License

MIT &copy; [Anton Kudryavtsev](https://github.com/Anidetrix)

## Thanks

- [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss) - for good reference 👍
- [rollup](https://github.com/rollup/rollup) - for awesome bundler 😎
