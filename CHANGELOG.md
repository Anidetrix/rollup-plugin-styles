# [3.2.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.1.0...v3.2.0) (2020-05-08)


### Features

* **import:** resolve extensions ([9005ab8](https://github.com/Anidetrix/rollup-plugin-styles/commit/9005ab8c4124f18cefcf94064abe191e60d1cca0))

# [3.1.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.6...v3.1.0) (2020-05-07)


### Bug Fixes

* **injector:** external @babel/runtime ([129aff5](https://github.com/Anidetrix/rollup-plugin-styles/commit/129aff515d5883809a7223f2a63e8aea5c45cd3a))


### Features

* **modules:** customizable `autoModules` ([c3298de](https://github.com/Anidetrix/rollup-plugin-styles/commit/c3298de27a7f983b4e013ce16dffbf8178d5d331))

## [3.0.6](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.5...v3.0.6) (2020-05-07)


### Bug Fixes

* **sourcemap:** more reliable detection ([a419361](https://github.com/Anidetrix/rollup-plugin-styles/commit/a419361e7db77255e0cb2a0343f27b145f6169b6))

## [3.0.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.4...v3.0.5) (2020-05-06)


### Bug Fixes

* misc fixes ([a4d3924](https://github.com/Anidetrix/rollup-plugin-styles/commit/a4d39247f10a7b3801b6ebbda60bf35a0dcd4e49))

## [3.0.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.3...v3.0.4) (2020-05-05)


### Bug Fixes

* **readme:** clarification ([6f5b995](https://github.com/Anidetrix/rollup-plugin-styles/commit/6f5b99500c291db3e37a82954e02ba4ffe019dbd))

## [3.0.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.2...v3.0.3) (2020-05-05)


### Bug Fixes

* **url handler:** working default `assetDir` ([7187a27](https://github.com/Anidetrix/rollup-plugin-styles/commit/7187a271e3235183dd0e78790faeb482a0d0e775))

## [3.0.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.1...v3.0.2) (2020-05-05)


### Bug Fixes

* hashed url handling ([5735a01](https://github.com/Anidetrix/rollup-plugin-styles/commit/5735a01c6c3035aaa4089e41437ea5a2cd6b6fed))

## [3.0.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.0.0...v3.0.1) (2020-05-05)


### Bug Fixes

* normalize assetFileNames dir ([f551a76](https://github.com/Anidetrix/rollup-plugin-styles/commit/f551a76a4d89eaeaceb2a134e32bf318402e215a))

# [3.0.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.2.4...v3.0.0) (2020-05-05)


### Features

* v3 ([c0a7daa](https://github.com/Anidetrix/rollup-plugin-styles/commit/c0a7daa767ccb94e06ea1509e3cc012fca4ae2d9))


### BREAKING CHANGES

* Some breaking changes occured:
* output.assetFileNames is now respected for both CSS files and assets from CSS
* `extract`'s path now should be relative to output dir/output file's basedir, but not outside of it
* `extract`'s path no longer passed to PostCSS as `to`, added dedicated `to` option instead
* Removed `hash` option from url handler (now handled by Rollup's assetFileName)
* `assetDir` option for url handler no longer affects resulting URL
* signature changes for `onExtract`
As always, please consult documentation and API Reference for details

## [2.2.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.2.3...v2.2.4) (2020-05-04)


### Bug Fixes

* missing fs-extra ([4173a2a](https://github.com/Anidetrix/rollup-plugin-styles/commit/4173a2aa0c07cca518e1bf54091a32003177d915))

## [2.2.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.2.2...v2.2.3) (2020-05-04)


### Bug Fixes

* do not bundle mime-types ([e444f04](https://github.com/Anidetrix/rollup-plugin-styles/commit/e444f049f71a138702d1b1a439205263cf80c299))

## [2.2.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.2.1...v2.2.2) (2020-05-04)


### Bug Fixes

* **styles-url:** clarify which url is unresolved ([aefc263](https://github.com/Anidetrix/rollup-plugin-styles/commit/aefc26359607954832c06d6ca72c97829cb2ee3c))

## [2.2.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.2.0...v2.2.1) (2020-05-04)


### Bug Fixes

* skip parsing of invalid sourcemaps ([a96d01f](https://github.com/Anidetrix/rollup-plugin-styles/commit/a96d01f6e0ff7253c6f2477147ef241dde19fe75))

# [2.2.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.1.1...v2.2.0) (2020-05-03)


### Features

* **injector:** one less polyfill needed for ie8 ([97796d8](https://github.com/Anidetrix/rollup-plugin-styles/commit/97796d8a7b8e5029f14681ac3062895133491c14))

## [2.1.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.1.0...v2.1.1) (2020-05-03)


### Bug Fixes

* **injector:** pass selector instead of element as container ([63bc959](https://github.com/Anidetrix/rollup-plugin-styles/commit/63bc959bdabcdea5b3855232bce4fe78be6da26f))

# [2.1.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.0.5...v2.1.0) (2020-05-02)


### Features

* extended browser support (>=ie9, or >=ie8 with polyfills) ([d849278](https://github.com/Anidetrix/rollup-plugin-styles/commit/d849278b10d544b7d7e31cc03ff8042e287138c6))

## [2.0.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.0.4...v2.0.5) (2020-05-02)


### Bug Fixes

* revert <no source> removal ([8def44e](https://github.com/Anidetrix/rollup-plugin-styles/commit/8def44e13581dc6ddcee1e71893fcba1cf6a2094))

## [2.0.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.0.3...v2.0.4) (2020-05-02)


### Bug Fixes

* remove <no source> from sourcemap ([b1c32e8](https://github.com/Anidetrix/rollup-plugin-styles/commit/b1c32e8c4c31d506df01d87669bcfbe8e2daab4c))

## [2.0.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.0.2...v2.0.3) (2020-05-01)

## [2.0.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.0.1...v2.0.2) (2020-05-01)


### Bug Fixes

* avoid postcss warning about no plugins ([dbd72b7](https://github.com/Anidetrix/rollup-plugin-styles/commit/dbd72b7792ec109c1efbf052af88149e45fda204))



## [2.0.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v2.0.0...v2.0.1) (2020-05-01)


### Bug Fixes

* remove puppeteer ([13bf4e8](https://github.com/Anidetrix/rollup-plugin-styles/commit/13bf4e845d3bc8f9ef67803259371808b95871ef))



# [2.0.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.5.2...v2.0.0) (2020-05-01)


### Features

* **styles:** v2 ([21d2c9d](https://github.com/Anidetrix/rollup-plugin-styles/commit/21d2c9da95afa0ff34bddf57e4aa0a54d5878490))


### BREAKING CHANGES

* **styles:** A lot of API and behavior changes, please consult README and API Reference



## [1.5.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.5.1...v1.5.2) (2020-04-06)


### Bug Fixes

* better lf placement for output ([663c184](https://github.com/Anidetrix/rollup-plugin-styles/commit/663c1844670a5dcd2f0d6a5b1152ea8d2d2a5784))



## [1.5.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.5.0...v1.5.1) (2020-04-06)


### Bug Fixes

* test and warning for already processed files ([19fd942](https://github.com/Anidetrix/rollup-plugin-styles/commit/19fd94283c231d69eb2de7628d1da69a7ce70f1f))



# [1.5.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.4.0...v1.5.0) (2020-04-06)


### Features

* allow multiple instances of the plugin ([aa0d4d1](https://github.com/Anidetrix/rollup-plugin-styles/commit/aa0d4d1788e726794c8f21857b2c65d0818241b9))



# [1.4.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.15...v1.4.0) (2020-04-04)


### Features

* dir in css modules class names ([94d10b2](https://github.com/Anidetrix/rollup-plugin-styles/commit/94d10b2c69258f96a85b58a3f6a895a077d7ea9c))



## [1.3.15](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.14...v1.3.15) (2020-03-30)


### Bug Fixes

* **p-queue:** proper default size ([156ebff](https://github.com/Anidetrix/rollup-plugin-styles/commit/156ebff051819737507b671ce5fa2e19b1f0814d))



## [1.3.14](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.13...v1.3.14) (2020-03-30)


### Performance Improvements

* global p-queue for all loaders ([ccac951](https://github.com/Anidetrix/rollup-plugin-styles/commit/ccac95125b60b7c2914ffa642afd815d0307544d))



## [1.3.13](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.12...v1.3.13) (2020-03-29)


### Bug Fixes

* fix production build, also speed up builds ([b5b2e4f](https://github.com/Anidetrix/rollup-plugin-styles/commit/b5b2e4f276aa004827b9509cab97321b00405573))



## [1.3.12](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.11...v1.3.12) (2020-03-29)


### Bug Fixes

* respect NODE_ENV ([7a600c3](https://github.com/Anidetrix/rollup-plugin-styles/commit/7a600c3b67b8d31f8ca6ad69180c3d62566cecf2))



## [1.3.11](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.10...v1.3.11) (2020-03-29)


### Performance Improvements

* bundle minification ([369279a](https://github.com/Anidetrix/rollup-plugin-styles/commit/369279a54ba5395d1937bb3027902f1351ab15d9))



## [1.3.10](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.9...v1.3.10) (2020-03-27)


### Bug Fixes

* proper declaration file ([0b5502b](https://github.com/Anidetrix/rollup-plugin-styles/commit/0b5502bc9760905c9c33c08e43567797cc24ed84))



## [1.3.9](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.8...v1.3.9) (2020-03-24)


### Bug Fixes

* **less:** add plugins to less loader options type ([8b502ef](https://github.com/Anidetrix/rollup-plugin-styles/commit/8b502efdd6dca8191a1a5cc1014f2351b05b7ce7))



## [1.3.8](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.7...v1.3.8) (2020-03-24)


### Performance Improvements

* **runtime:** less operations ([7375fe7](https://github.com/Anidetrix/rollup-plugin-styles/commit/7375fe76541364431eab741eff77970a201d97da))



## [1.3.7](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.6...v1.3.7) (2020-03-21)


### Performance Improvements

* **postcss:** less allocations ([c9ac3f5](https://github.com/Anidetrix/rollup-plugin-styles/commit/c9ac3f5b6672f917fdc7cff55042d58dd26264d8))



## [1.3.6](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.5...v1.3.6) (2020-03-20)


### Bug Fixes

* **less:** use provided less in importer ([66f0fce](https://github.com/Anidetrix/rollup-plugin-styles/commit/66f0fcec291316887f0b6a892f49a3064e467607))



## [1.3.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.4...v1.3.5) (2020-03-20)


### Bug Fixes

* **types:** fix less typings ([c129dec](https://github.com/Anidetrix/rollup-plugin-styles/commit/c129decfd12d98db5944dcae9a4ae8cbdf569e1c))



## [1.3.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.3...v1.3.4) (2020-03-20)


### Performance Improvements

* **less:** less allocations in importer ([bf3710a](https://github.com/Anidetrix/rollup-plugin-styles/commit/bf3710a3b41f79a437548abdb0d80f319acaa430))



## [1.3.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.2...v1.3.3) (2020-03-20)


### Bug Fixes

* **less:** remove less from bundle ([9dafe0a](https://github.com/Anidetrix/rollup-plugin-styles/commit/9dafe0a2e998cd7b311e8b0165b7a53e7111ec6c))



## [1.3.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.3.1...v1.3.2) (2020-03-20)


### Bug Fixes

* **less:** fileManager inheritance ([aba12a4](https://github.com/Anidetrix/rollup-plugin-styles/commit/aba12a46968ce3882ede37cb7115c29893865850))



## [1.3.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.6...v1.3.1) (2020-03-20)


### Bug Fixes

* **less:** fix importer ([7900186](https://github.com/Anidetrix/rollup-plugin-styles/commit/79001867cec230c900db2a1288016748a849b4f4))


### Features

* support partials and ~ in Less [@import](https://github.com/import) statements ([b4fbda5](https://github.com/Anidetrix/rollup-plugin-styles/commit/b4fbda5c0f93b0f23c3226c58fcb7dd21b26802f))



## [1.2.6](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.5...v1.2.6) (2020-03-19)


### Performance Improvements

* relace import-cwd with resolve ([dd4310e](https://github.com/Anidetrix/rollup-plugin-styles/commit/dd4310e34f8bac1f1f6c471cc116a7a73b3ac2fb))



## [1.2.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.4...v1.2.5) (2020-03-18)


### Bug Fixes

* respect rollup's sourcemap ([cc6ad34](https://github.com/Anidetrix/rollup-plugin-styles/commit/cc6ad3430caf42681a9f5030beb1b0566e4cce34))



## [1.2.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.3...v1.2.4) (2020-03-18)


### Bug Fixes

* **deps:** more precise pkg versions ([403158c](https://github.com/Anidetrix/rollup-plugin-styles/commit/403158c4ba89428d002f07abc060fffbe7ffa95b))



## [1.2.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.2...v1.2.3) (2020-03-18)


### Bug Fixes

* **path-utils:** fix relativePath ([e22ca71](https://github.com/Anidetrix/rollup-plugin-styles/commit/e22ca71b351b9a1232be66c80f4f8546ed7e9fce))



## [1.2.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.1...v1.2.2) (2020-03-18)


### Bug Fixes

* **extract:** allow paths relative to cwd ([bdfc266](https://github.com/Anidetrix/rollup-plugin-styles/commit/bdfc266bd5c792fe01b93473747a44c03835c2ac))


### Performance Improvements

* **path:** unneded normalization ([df03c59](https://github.com/Anidetrix/rollup-plugin-styles/commit/df03c5969365390a8ac93b62e770ebee926f3de9))



## [1.2.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.2.0...v1.2.1) (2020-03-17)


### Bug Fixes

* **options:** `use` type ([41884fb](https://github.com/Anidetrix/rollup-plugin-styles/commit/41884fb9674c06651003a0931ffd9aec7ce8b021))



# [1.2.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.11...v1.2.0) (2020-03-17)


### Features

* **styles:** postcss plugins without require ([7db718f](https://github.com/Anidetrix/rollup-plugin-styles/commit/7db718f7e432b40e2c9965345e97e66fd4149a53))



## [1.1.11](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.10...v1.1.11) (2020-03-16)


### Bug Fixes

* **readme:** tagline wording ([0a55020](https://github.com/Anidetrix/rollup-plugin-styles/commit/0a550205a2dd1e559aa1eda5ad42d4648e220ba5))



## [1.1.10](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.9...v1.1.10) (2020-03-16)


### Bug Fixes

* **readme:** fix more links ([c4e6690](https://github.com/Anidetrix/rollup-plugin-styles/commit/c4e6690ccdcc3c3bd1e8b5874737f97fe12f1049))



## [1.1.9](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.8...v1.1.9) (2020-03-16)


### Bug Fixes

* **readme:** fix links ([208c254](https://github.com/Anidetrix/rollup-plugin-styles/commit/208c25454f4762c908d9eb3a0d2a2d14b17eac81))



## [1.1.8](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.7...v1.1.8) (2020-03-15)


### Performance Improvements

* **postcss:** less type checking ([5611655](https://github.com/Anidetrix/rollup-plugin-styles/commit/56116555c2bb67734b684fed3f91a272ab98aa50))
* **sourcemap:** less operations ([178e2d4](https://github.com/Anidetrix/rollup-plugin-styles/commit/178e2d4c9f7662afc928d288ef43dd03fb704f1b))



## [1.1.7](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.6...v1.1.7) (2020-03-15)


### Performance Improvements

* **project:** refactoring and optimizations ([d3405aa](https://github.com/Anidetrix/rollup-plugin-styles/commit/d3405aa7a445264a664d2246acc13b79c4ed68b5))



## [1.1.6](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.5...v1.1.6) (2020-03-15)


### Bug Fixes

* **build:** add dependabot and dependency badge ([761e3ed](https://github.com/Anidetrix/rollup-plugin-styles/commit/761e3edabf842df7a91698a925b9df3c18ae0dd0))



## [1.1.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.4...v1.1.5) (2020-03-14)


### Bug Fixes

* **ci:** do not release twice ([fc719f2](https://github.com/Anidetrix/rollup-plugin-styles/commit/fc719f2bc78b18896050f938e06dd1ad84011150))



## [1.1.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.3...v1.1.4) (2020-03-14)


### Bug Fixes

* **node:** wrong supported version of Node.js ([3fb9f80](https://github.com/Anidetrix/rollup-plugin-styles/commit/3fb9f802d4d2acea67bb68b8e875142daab6ba80))



## [1.1.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.2...v1.1.3) (2020-03-14)


### Bug Fixes

* **runtime:** working singleTag option ([5d6a5c8](https://github.com/Anidetrix/rollup-plugin-styles/commit/5d6a5c8d3f6e88130150b721d2ec9ef8adfb687b))



## [1.1.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.1...v1.1.2) (2020-03-13)


### Performance Improvements

* **styles:** do not call path.join twice ([272bb8b](https://github.com/Anidetrix/rollup-plugin-styles/commit/272bb8b61154f804c20f20d5854d836d3359721c))



## [1.1.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.1.0...v1.1.1) (2020-03-13)


### Bug Fixes

* **styles:** clean dist ([511ea8d](https://github.com/Anidetrix/rollup-plugin-styles/commit/511ea8deda62bc9c3e75657292b293ab7bf24f5e))



# [1.1.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v1.0.5...v1.1.0) (2020-03-13)


### Bug Fixes

* **styles:** fix CSS injector ([f4ccef4](https://github.com/Anidetrix/rollup-plugin-styles/commit/f4ccef46cf309c2e2af05dbeedbe1474fd561503))


### Features

* **styles:** add singleTag option for CSS injection ([b7e4ca8](https://github.com/Anidetrix/rollup-plugin-styles/commit/b7e4ca8d5f85d62b5fbe6ecf0029646392509228))


### Performance Improvements

* **styles:** small CSS injector optimization ([fbdd413](https://github.com/Anidetrix/rollup-plugin-styles/commit/fbdd413fb408f9a90557c524639bda135de0742b))



## 1.0.5 (2020-03-13)
