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
yarn add rollup-plugin-styles --dev
```

## Usage

```js
// rollup.config.js
import styles from "rollup-plugin-styles";

export default {
  plugins: [styles()],
};
```

After that you can import CSS files in your code:

```js
import "./style.css";
```

Note that, by default, generated CSS will be injected into `<head>`, with CSS also available as default export unless `extract: true`:

```js
// Inject into `<head>`, also available as `style` object in this example
import style from "./style.css";
```

This plugin will also automatically detect and use local PostCSS config files.

### CSS Extraction

```js
styles({
  extract: true,
  // ...or with absolute/relative to current working directory path
  // Note: also acts as `to` for PostCSS
  extract: "dist/awesome-bundle.css",
});
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

- For `Sass` support install `node-sass`:
  ```bash
  yarn add node-sass --dev
  ```
  - ...or `sass`:
  ```bash
  yarn add sass --dev
  ```
- For `Stylus` support install `stylus`:
  ```bash
  yarn add stylus --dev
  ```
- For `Less` support install `less`:
  ```bash
  yarn add less --dev
  ```

That's it, now you can import `.scss` `.sass` `.styl` `.stylus` `.less` files in your code.

#### `fibers` (**Sass/Scss only**)

This plugin will auto detect `fibers` package when using `sass` implementation

> When installed via npm, `Dart Sass` supports a JavaScript API that's fully compatible with `Node Sass` <...>, with support for both the render() and renderSync() functions. <...>
>
> Note however that by default, **renderSync() is more than twice as fast as render()** due to the overhead of asynchronous callbacks. To avoid this performance hit, render() can use the `fibers` package to call asynchronous importers from the synchronous code path.
>
> [Source](https://github.com/sass/dart-sass/blob/master/README.md#javascript-api)

To install `fibers`:

```bash
yarn add fibers --dev
```

#### imports (**Sass/Scss/Less**)

Similar to how webpack's [sass-loader](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules) works, you can prepend the import path with `~` to tell this plugin to resolve in `node_modules`:

```scss
@import "~bulma/css/bulma";
```

## Options

See [Options](https://anidetrix.github.io/rollup-plugin-styles/interfaces/options.html) for full list of available options.

## Differences from [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)

- Written completely in TypeScript
- [CSS Modules](https://github.com/css-modules/css-modules) implementation compatible with plugins like [postcss-import](https://github.com/postcss/postcss-import) and [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties)
- Support for partials and ~ in Less files
- Proper sourcemap generation for all loaders
- Proper order of imported CSS chunks
- Sourcemaps include source content
- Correct inline sourcemaps
- Correct relative source paths in extracted sourcemaps
- Can accept sourcemaps from previous plugins
- Extracts sourcemaps from loaded files
- More bug fixes here and there

## Contribute

Any contributions are always welcome, not only Pull Requests! 😀

- **QA**: file bug reports, the more details you can give the better
- **Code**: take a look at the [open issues](https://github.com/Anidetrix/rollup-plugin-styles/issues), even if you can't write code showing that you care about a given issue matters
- **Ideas**: feature requests are welcome

Your First Contribution? You can learn how from this _free_ series, [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

## License

MIT &copy; [Anton Kudryavtsev](https://github.com/Anidetrix)

## Thanks

- [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss) - for good reference 👍
- [rollup](https://github.com/rollup/rollup) - for awesome bundler 😎
