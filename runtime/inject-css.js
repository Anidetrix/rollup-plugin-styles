/* eslint-env browser */

/** @type {HTMLElement[]} */
const containers = [];
/** @type {{prepend:HTMLStyleElement,append:HTMLStyleElement}[]} */
const styleTags = [];

/**
 * @param {string|undefined} css
 * @param {object} [options={}]
 * @param {boolean} [options.prepend]
 * @param {boolean} [options.singleTag]
 * @param {HTMLElement} [options.container]
 * @returns {void}
 */
export default (css, options = {}) => {
  if (!css || typeof document === "undefined") return;
  const singleTag = typeof options.singleTag !== "undefined" ? options.singleTag : false;
  const container = typeof options.container !== "undefined" ? options.container : document.head;
  const position = options.prepend === true ? "prepend" : "append";

  const createStyleTag = () => {
    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    if (position === "prepend" && container.firstChild) {
      container.insertBefore(styleTag, container.firstChild);
    } else {
      container.append(styleTag);
    }
    return styleTag;
  };

  /** @type {HTMLStyleElement} */
  let styleTag;

  if (singleTag) {
    let id = containers.indexOf(container);

    if (id === -1) {
      id = containers.push(container) - 1;
      styleTags[id] = {};
    }

    if (styleTags[id] && styleTags[id][position]) {
      styleTag = styleTags[id][position];
    } else {
      styleTag = styleTags[id][position] = createStyleTag();
    }
  } else {
    styleTag = createStyleTag();
  }

  // strip potential UTF-8 BOM if css was read from a file
  if (css.charCodeAt(0) === 0xfeff) css = css.slice(1);

  if (styleTag.styleSheet) {
    styleTag.styleSheet.cssText += css;
  } else {
    styleTag.textContent += css;
  }
};
