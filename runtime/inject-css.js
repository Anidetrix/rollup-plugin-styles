/** @type {HTMLElement[]} */
var containers = [];
/** @type {{prepend:HTMLStyleElement,append:HTMLStyleElement}[]} */
var styleTags = [];

/**
 * @param {string} css
 * @param {object} [options={}]
 * @param {boolean} [options.prepend]
 * @param {boolean} [options.singleTag]
 * @param {string} [options.container]
 * @returns {void}
 */
export default function (css, options) {
  if (!css || typeof document === "undefined") return;
  if (typeof options === "undefined") options = {};

  var position = options.prepend === true ? "prepend" : "append";
  var singleTag = typeof options.singleTag !== "undefined" ? options.singleTag : false;

  var container =
    typeof options.container !== "undefined"
      ? document.querySelector(options.container)
      : document.getElementsByTagName("head")[0];

  function createStyleTag() {
    var styleTag = document.createElement("style");
    styleTag.setAttribute("type", "text/css");
    var pos = position === "prepend" ? "afterbegin" : "beforeend";
    container.insertAdjacentElement(pos, styleTag);
    return styleTag;
  }

  /** @type {HTMLStyleElement} */
  var styleTag;

  if (singleTag) {
    var id = containers.indexOf(container);

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
  if (css.charCodeAt(0) === 0xfeff) css = css.substring(1);

  if (styleTag.styleSheet) {
    styleTag.styleSheet.cssText += css;
  } else {
    styleTag.appendChild(document.createTextNode(css));
  }
}
