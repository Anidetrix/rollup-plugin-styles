# [4.0.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.14.1...v4.0.0) (2022-01-14)


### Bug Fixes

* **code generation:** imports should precede exports ([814ccdb](https://github.com/Anidetrix/rollup-plugin-styles/commit/814ccdbfea44bbd9c706b7a2a70ed91959ce3031))
* remove debugging log ([e09ac09](https://github.com/Anidetrix/rollup-plugin-styles/commit/e09ac0927053ffba52410e1d36b6b1c74ae63155))
* **sass!:** remove `fibers` support ([8992356](https://github.com/Anidetrix/rollup-plugin-styles/commit/89923569df14090710263e0d6285d64aef16c1ba))


### Features

* **cssnano!:** v5 ([5d6ccc1](https://github.com/Anidetrix/rollup-plugin-styles/commit/5d6ccc1ecbd310ecbb299ea46debc2ce931acb4d))
* **node:** drop v10 ([5786615](https://github.com/Anidetrix/rollup-plugin-styles/commit/57866150e92c0decf16eeb336608227de47e03eb))


### Performance Improvements

* removed deprecated rollup API ([46b73e6](https://github.com/Anidetrix/rollup-plugin-styles/commit/46b73e65ecc2c672bed317c1011ed50322c8c07b))
* **sourcemap:** switch to `source-map-js` ([0488634](https://github.com/Anidetrix/rollup-plugin-styles/commit/04886348dc71a43c91f4eec2e49cd0e5aadc0895))
* Use Set to optimize performance ([b402687](https://github.com/Anidetrix/rollup-plugin-styles/commit/b40268744b57faf85b2e1a37b417f00be7ec6123))


### BREAKING CHANGES

* **node:** Now support v12.20.0 and up

## [3.14.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.14.0...v3.14.1) (2021-01-28)


### Bug Fixes

* filter out only related files ([0976e8f](https://github.com/Anidetrix/rollup-plugin-styles/commit/0976e8f196aba095cb3a1623b03cd7c2622e5365))
* more reliable chunk hash augmentation ([91f9b8f](https://github.com/Anidetrix/rollup-plugin-styles/commit/91f9b8f66411ac44176ac3f32bbd3fd673151172)), closes [#143](https://github.com/Anidetrix/rollup-plugin-styles/issues/143)

# [3.14.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.13.0...v3.14.0) (2021-01-25)


### Features

* pass resulting filename to sourcemap transformer when possible ([5570cf4](https://github.com/Anidetrix/rollup-plugin-styles/commit/5570cf43425277a6c0699021092812d022235cb5))

# [3.13.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.12.2...v3.13.0) (2021-01-24)


### Bug Fixes

* respect esm and styles for sync resolves ([0c51253](https://github.com/Anidetrix/rollup-plugin-styles/commit/0c512539963599ba71680d7b938e18c4519c9979))


### Features

* sourcemap transformation ([ed49328](https://github.com/Anidetrix/rollup-plugin-styles/commit/ed493281e59766a84374534a5832c39802579bd5)), closes [#160](https://github.com/Anidetrix/rollup-plugin-styles/issues/160)

## [3.12.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.12.1...v3.12.2) (2021-01-11)


### Bug Fixes

* occasional wrong order in extract mode ([52cb377](https://github.com/Anidetrix/rollup-plugin-styles/commit/52cb3770250907f834f6b5019909d32522a33de3)), closes [#153](https://github.com/Anidetrix/rollup-plugin-styles/issues/153)



## [3.12.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.12.0...v3.12.1) (2020-12-30)


### Bug Fixes

* keep references inside declaration ([a6f9b35](https://github.com/Anidetrix/rollup-plugin-styles/commit/a6f9b35d12a6cbcfa4b2ac8e144806aee7a749a1)), closes [#159](https://github.com/Anidetrix/rollup-plugin-styles/issues/159)
* postcss related types ([df78c78](https://github.com/Anidetrix/rollup-plugin-styles/commit/df78c78130239ada661f9a3908901fa17be09e57))



# [3.12.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.11.0...v3.12.0) (2020-12-28)


### Bug Fixes

* resolving `url` outside of first order place ([c61f0ce](https://github.com/Anidetrix/rollup-plugin-styles/commit/c61f0ce56769673657b96a6a73685a456eeb3eec)), closes [#126](https://github.com/Anidetrix/rollup-plugin-styles/issues/126)
* **less:** respect `paths` options ([a72ab4c](https://github.com/Anidetrix/rollup-plugin-styles/commit/a72ab4cee52b866bd901f296af14f4346fc89df2)), closes [#125](https://github.com/Anidetrix/rollup-plugin-styles/issues/125)
* avoid partial names replacement when aliasing ([f5aa1e2](https://github.com/Anidetrix/rollup-plugin-styles/commit/f5aa1e254016bfc6c0695c5bff75424fd603a5d5))
* **utils:** async resolve types ([08ae382](https://github.com/Anidetrix/rollup-plugin-styles/commit/08ae382212d51fec54e45610c50f3c3896ed99e2))


### Features

* silently skip empty files ([a34bdbf](https://github.com/Anidetrix/rollup-plugin-styles/commit/a34bdbf91a9d00db0c75ccc1a1ac87b9f985463a))
* support functional assetFileNames ([91d4ca2](https://github.com/Anidetrix/rollup-plugin-styles/commit/91d4ca2e97059add53b56bc8473a088ed274ce81))
* support web url and query strings inside [@import](https://github.com/import) ([bbff4e5](https://github.com/Anidetrix/rollup-plugin-styles/commit/bbff4e524bf1e162d9bb4a9808e31a9c72d29ccc)), closes [#140](https://github.com/Anidetrix/rollup-plugin-styles/issues/140)



# [3.11.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.10.1...v3.11.0) (2020-10-10)


### Bug Fixes

* infinite postcss loop ([c8cf892](https://github.com/Anidetrix/rollup-plugin-styles/commit/c8cf8927448d975e6f66e1186190bb908cce03fe))


### Features

* postcss 8 upgrade ([b9adee9](https://github.com/Anidetrix/rollup-plugin-styles/commit/b9adee9fd7d0deeb994dc20314d74dfba4b3ee37))


### Reverts

* Revert "chore(release): 3.10.1 [skip ci]" ([dc16939](https://github.com/Anidetrix/rollup-plugin-styles/commit/dc169397897cda3e61119ed1c7895d8342942426))



## [3.10.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.10.0...v3.10.1) (2020-10-07)


### Bug Fixes

* correctly resolve file imports with query params ([#148](https://github.com/Anidetrix/rollup-plugin-styles/issues/148)) ([71bfe87](https://github.com/Anidetrix/rollup-plugin-styles/commit/71bfe875b96f1b7f240b2b8e334ad6385db56c79)), closes [#132](https://github.com/Anidetrix/rollup-plugin-styles/issues/132)



# [3.10.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.9.0...v3.10.0) (2020-06-26)


### Bug Fixes

* **extract:** missing parts of extracted file ([9afa9ac](https://github.com/Anidetrix/rollup-plugin-styles/commit/9afa9acf51da0a8ca2a86fa121c50a5b60648d58))
* **runtime:** safer option check ([78a5922](https://github.com/Anidetrix/rollup-plugin-styles/commit/78a59228d4ce01b08570379158fb449bdf96d4a2))
* **url:** consider all possible basedirs ([62353b2](https://github.com/Anidetrix/rollup-plugin-styles/commit/62353b28d3666be1f7fdf8d2c36ac998772092d7))


### Features

* .d.ts generation and treeshakeable injector options ([2990cb0](https://github.com/Anidetrix/rollup-plugin-styles/commit/2990cb0f9fa3621b4e3acc00bef1fc4d12d9035b))
* **postcss:** support both object and array for plugin ([7ce53b9](https://github.com/Anidetrix/rollup-plugin-styles/commit/7ce53b96f3870947883ae4b79ba48da24e8c76fb))



# [3.9.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.8.2...v3.9.0) (2020-06-23)


### Bug Fixes

* very rare double code extraction ([d89a5fe](https://github.com/Anidetrix/rollup-plugin-styles/commit/d89a5feca9885159ef86b7a6c33f89b3bf3b130e))


### Features

* replace `postcss-load-config` with custom implementation ([50b19bb](https://github.com/Anidetrix/rollup-plugin-styles/commit/50b19bb409d00562cf90b9939bde65d3be42497f))
* respect rollup's 2.18.0 option changes ([53072b0](https://github.com/Anidetrix/rollup-plugin-styles/commit/53072b0a17d1ee12ce8cea221e67102dad54553c))


### Performance Improvements

* misc optimizations ([df1d1ee](https://github.com/Anidetrix/rollup-plugin-styles/commit/df1d1ee3a9a0f2c44f47b4afaf9ad522fccb4471))
* **modules:** simpler internal implementation ([c1f92e1](https://github.com/Anidetrix/rollup-plugin-styles/commit/c1f92e1b0c942f25e25a6cdbf2d812bde281aec9))


### Reverts

* Revert "chore(release): 3.8.3 [skip ci]" ([49b18ff](https://github.com/Anidetrix/rollup-plugin-styles/commit/49b18ffe95dacef74e5e280915fe44e0bbc77ed6))



## [3.8.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.8.1...v3.8.2) (2020-06-11)


### Bug Fixes

* missing/overwritten files ([b4dc69c](https://github.com/Anidetrix/rollup-plugin-styles/commit/b4dc69c6223883abd6251b7c41e6a1b7020874bf))
* **loaders:** clearly show what options are public ([2ab86be](https://github.com/Anidetrix/rollup-plugin-styles/commit/2ab86bebba8e3a8126ae9b5f473991e1abf2bab8))
* **partials:** incorrect path without dir in url ([68d40be](https://github.com/Anidetrix/rollup-plugin-styles/commit/68d40be429dc811134dd67a3df53e8f6033f93d1))


### Performance Improvements

* tiny optimizations ([309e37b](https://github.com/Anidetrix/rollup-plugin-styles/commit/309e37b87dcaf4f0bb82c687697a5c4f1574982b))



## [3.8.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.8.0...v3.8.1) (2020-06-11)


### Bug Fixes

* fix overwrite style file in preserveModules mode ([2c13345](https://github.com/Anidetrix/rollup-plugin-styles/commit/2c13345b3e382976da78bbfddf478be5bf8b30fc))
* use path.parse instead of regex ([135b658](https://github.com/Anidetrix/rollup-plugin-styles/commit/135b65813cf88a159a00732c558b9a3424192083))



# [3.8.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.7.1...v3.8.0) (2020-06-08)


### Features

* **sass:** sync mode support with dart implementation ([91846bc](https://github.com/Anidetrix/rollup-plugin-styles/commit/91846bcc07b6474147a96ca0ea426663a49f3de8))


### Performance Improvements

* overall considerable performance improvements ([6c08d55](https://github.com/Anidetrix/rollup-plugin-styles/commit/6c08d55358c36a4ef635bbe68cab39091fe3cab8))
* replace concat-with-sourcemaps with custom function ([a1b04d2](https://github.com/Anidetrix/rollup-plugin-styles/commit/a1b04d23e88652db5f894a2e994e587b95293cf0))
* resolved modules caching ([7eab36d](https://github.com/Anidetrix/rollup-plugin-styles/commit/7eab36d30ffcf99df7ff9e4bddbb710ccca9aaf1))



## [3.7.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.7.0...v3.7.1) (2020-05-31)


### Bug Fixes

* respect content option for minification ([59b3c07](https://github.com/Anidetrix/rollup-plugin-styles/commit/59b3c07c3d5d7c428aa2eab33d0e9b0c0295ab8d))



# [3.7.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.6.1...v3.7.0) (2020-05-31)


### Features

* option to disable `sourcesContent` in sourcemaps ([afc440b](https://github.com/Anidetrix/rollup-plugin-styles/commit/afc440b6cfba5f24ddf989f7c8bb8d44f02b7dce))



## [3.6.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.6.0...v3.6.1) (2020-05-27)


### Bug Fixes

* respect programmatic manual chunks as well ([311e0dc](https://github.com/Anidetrix/rollup-plugin-styles/commit/311e0dcb4aae623e3bb62a873d55ba89210a1823))



# [3.6.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.5.5...v3.6.0) (2020-05-27)


### Bug Fixes

* **build:** disable minification for use with `patch-package` ([fbba337](https://github.com/Anidetrix/rollup-plugin-styles/commit/fbba337c063bd0f2b41bc83e88e7e532fa7b6347))


### Features

* **code splitting:** rollup's `manualChunks` option support ([5aeb350](https://github.com/Anidetrix/rollup-plugin-styles/commit/5aeb350e12e57834027d4046aabf923524f5cf21))
* **injector:** ability to set attibutes ([653e91c](https://github.com/Anidetrix/rollup-plugin-styles/commit/653e91cd76148e87b2de5c703c08fd9d209ef94b))


### Performance Improvements

* replace some sets with arrays ([2b7c28e](https://github.com/Anidetrix/rollup-plugin-styles/commit/2b7c28ee763b63e36e900389921b9bb19de1629f))



## [3.5.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.5.4...v3.5.5) (2020-05-23)


### Bug Fixes

* **changelog:** repairs after github breakage ([b01e058](https://github.com/Anidetrix/rollup-plugin-styles/commit/b01e0588e493e7807de37b2a3b8b7a897735afa9))



## [3.5.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.5.3...v3.5.4) (2020-05-23)


### Bug Fixes

* trigger release due to `semantic-release` failure (see [here](https://github.com/Anidetrix/rollup-plugin-styles/blob/master/CHANGELOG.md[#354](https://github.com/Anidetrix/rollup-plugin-styles/issues/354)-2020-05-22)) ([c9e6acf](https://github.com/Anidetrix/rollup-plugin-styles/commit/c9e6acff8b4141476b0566ef5b0dc435fde1b5b9)), closes [/github.com/Anidetrix/rollup-plugin-styles/blob/master/CHANGELOG.md#354-2020-05-22](https://github.com//github.com/Anidetrix/rollup-plugin-styles/blob/master/CHANGELOG.md/issues/354-2020-05-22)
* **code splitting:** infinite loop on cyclic imports ([4dd0ca3](https://github.com/Anidetrix/rollup-plugin-styles/commit/4dd0ca338be34315cb7b9475e932cabd005c61b9))



## [3.5.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.5.2...v3.5.3) (2020-05-20)


### Bug Fixes

* small misc fixes and changes ([7cbb05a](https://github.com/Anidetrix/rollup-plugin-styles/commit/7cbb05a6269c40b22e03acc84b45fedb82277aeb))



## [3.5.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.5.1...v3.5.2) (2020-05-20)


### Bug Fixes

* better typedoc ([fb31286](https://github.com/Anidetrix/rollup-plugin-styles/commit/fb31286eff12eca938c9ce30b7422e01fb9e0fea))



## [3.5.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.5.0...v3.5.1) (2020-05-20)


### Bug Fixes

* typenames too long for typedoc ([13e2d49](https://github.com/Anidetrix/rollup-plugin-styles/commit/13e2d496582e026a1efb3bf9c2d75e296d6c1108))



# [3.5.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.4.3...v3.5.0) (2020-05-20)


### Bug Fixes

* **sass:** properly call custom resolvers ([002366f](https://github.com/Anidetrix/rollup-plugin-styles/commit/002366f03348f87ece42a5a0a271a568c9c2369e))
* **sourcemap:** broken single line URL comments extraction ([fd8ebf9](https://github.com/Anidetrix/rollup-plugin-styles/commit/fd8ebf99a788935d88ac407b98733315e27da791))


### Features

* **importer:** extensions override ([74fcd39](https://github.com/Anidetrix/rollup-plugin-styles/commit/74fcd395720c447ed56a6145bbaa410b802619d0))
* **url:** automatically inline assets in inject mode ([db7dc9a](https://github.com/Anidetrix/rollup-plugin-styles/commit/db7dc9a870199ecacbedb79720f78dead8164819))


### Performance Improvements

* overall improvements and optimizations ([a460dd0](https://github.com/Anidetrix/rollup-plugin-styles/commit/a460dd0233de61717039e5365cfcca858dcb1673))
* **types:** trimmed down vendor types ([6a52be8](https://github.com/Anidetrix/rollup-plugin-styles/commit/6a52be8c10ab067df6c1f1b3b63a67ce5485572f))



## [3.4.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.4.2...v3.4.3) (2020-05-17)


### Bug Fixes

* **code splitting:** potential over-extraction ([0b94909](https://github.com/Anidetrix/rollup-plugin-styles/commit/0b94909b4d20639ae3f9a5b2f7fcd9649d0ec2fc))



## [3.4.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.4.1...v3.4.2) (2020-05-17)


### Bug Fixes

* correct filename for single file /w `preserveModules` ([837f9ed](https://github.com/Anidetrix/rollup-plugin-styles/commit/837f9ed8f00565c5fb8a3920004fe06e1155e503))



## [3.4.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.4.0...v3.4.1) (2020-05-17)


### Bug Fixes

* correct multi-file detection ([d92d6da](https://github.com/Anidetrix/rollup-plugin-styles/commit/d92d6da45a9af8aa959b3693f7ef4a1418b6db57))



# [3.4.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.3.4...v3.4.0) (2020-05-16)


### Features

* code splitting rework /w `preserveModules` support ([8f44a7a](https://github.com/Anidetrix/rollup-plugin-styles/commit/8f44a7ab30d98438d2c60dde888b63f67a7f2ad1))



## [3.3.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.3.3...v3.3.4) (2020-05-15)


### Bug Fixes

* **stylus:** proper sourcesContent ([f9b4774](https://github.com/Anidetrix/rollup-plugin-styles/commit/f9b4774977d54e034b2f9cb02097ef0154046507))
* **stylus:** respect local node_modules ([eebbbed](https://github.com/Anidetrix/rollup-plugin-styles/commit/eebbbedc11909594f51faefb7373127106ed139d))


### Performance Improvements

* **less:** less code ([2717427](https://github.com/Anidetrix/rollup-plugin-styles/commit/27174273901813108c271906fbdc2d1aef4d1f7e))



## [3.3.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.3.2...v3.3.3) (2020-05-14)


### Bug Fixes

* **multi-entry:** correct and consistent order of single extracted file ([553ca85](https://github.com/Anidetrix/rollup-plugin-styles/commit/553ca85c8efe27007a1be22771bb8719fd54da40))
* do not depend on directory structure for hashing ([18c3022](https://github.com/Anidetrix/rollup-plugin-styles/commit/18c30225ccce6a0cdcd491d4933ca199132eda41))
* uniform sass error message ([49655a4](https://github.com/Anidetrix/rollup-plugin-styles/commit/49655a40479ff3e1a89f43cde8a88483c0209b90))



## [3.3.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.3.1...v3.3.2) (2020-05-13)


### Bug Fixes

* `onExtract` func check and desc ([4bfaac5](https://github.com/Anidetrix/rollup-plugin-styles/commit/4bfaac54917fe3f54520042996017553d6ac939f))



## [3.3.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.3.0...v3.3.1) (2020-05-13)


### Bug Fixes

* `onExtract` option fix ([65d74cf](https://github.com/Anidetrix/rollup-plugin-styles/commit/65d74cfb48086ca9dd9923fa942e56de17856292))



# [3.3.0](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.2.5...v3.3.0) (2020-05-12)


### Bug Fixes

* minimize exports in extract mode as well ([ab919d7](https://github.com/Anidetrix/rollup-plugin-styles/commit/ab919d7c815b8eaf543d0eec525db6b5323e4ec9))


### Features

* multi entry support ([840996c](https://github.com/Anidetrix/rollup-plugin-styles/commit/840996cbf8deb4b7928e90ff7ee346905a07fade))



## [3.2.5](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.2.4...v3.2.5) (2020-05-11)


### Bug Fixes

* **loaders:** run `sourcemap` loader first ([b651be3](https://github.com/Anidetrix/rollup-plugin-styles/commit/b651be35fe27b02670547fb639706feab68d5ab9))


### Performance Improvements

* simpler error handling ([438d5b1](https://github.com/Anidetrix/rollup-plugin-styles/commit/438d5b1d678854d4ad3cc18ebfdf5d0d0bcf1472))



## [3.2.4](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.2.3...v3.2.4) (2020-05-10)


### Bug Fixes

* **sourcemaps:** hashing and fixes for inlining in `extract` mode ([c2bb12d](https://github.com/Anidetrix/rollup-plugin-styles/commit/c2bb12d225d3b86909eeb5b32c85cd9ba8a9a0b0))
* better match Rollup's hashing method ([1825045](https://github.com/Anidetrix/rollup-plugin-styles/commit/18250456a568aab90c11bbbaa00ed1eef7bf7c7e))



## [3.2.3](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.2.2...v3.2.3) (2020-05-09)



## [3.2.2](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.2.1...v3.2.2) (2020-05-09)


### Bug Fixes

* **sass:** do not modify non-module url ([fd022c6](https://github.com/Anidetrix/rollup-plugin-styles/commit/fd022c644f6d9523d2db513952f98ed399b4b435))



## [3.2.1](https://github.com/Anidetrix/rollup-plugin-styles/compare/v3.2.0...v3.2.1) (2020-05-09)


### Bug Fixes

* respect `output.file` for main CSS chunk ([19eb9d7](https://github.com/Anidetrix/rollup-plugin-styles/commit/19eb9d71cbe1069f03ea4a2fce7340714a6be751))



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
