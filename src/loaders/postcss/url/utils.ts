import postcss from "postcss";
import valueParser, { Node, ParsedValue } from "postcss-value-parser";

const urlFuncRe = /^url$/i;
const imageSetFuncRe = /^(?:-webkit-)?image-set$/i;
const declWithUrlRe = new RegExp(
  [
    "(?:",
    [urlFuncRe, imageSetFuncRe].map(re => re.source.replace("$", "")).join("|"),
    ")",
    "\\(",
  ].join(""),
  "i",
);

export const isDeclWithUrl = (decl: postcss.Declaration): boolean => declWithUrlRe.test(decl.value);

export const walkUrls = (
  parsed: ParsedValue,
  callback: (url: string, node?: Node) => void,
): void => {
  parsed.walk(node => {
    if (node.type !== "function") return;

    if (urlFuncRe.test(node.value)) {
      const { nodes } = node;
      const [urlNode] = nodes;
      const url = urlNode?.type === "string" ? urlNode.value : valueParser.stringify(nodes);
      callback(url.replace(/^\s+|\s+$/g, ""), urlNode);
      return;
    }

    if (imageSetFuncRe.test(node.value)) {
      for (const nNode of node.nodes) {
        if (nNode.type === "string") {
          callback(nNode.value.replace(/^\s+|\s+$/g, ""), nNode);
          continue;
        }

        if (nNode.type === "function" && urlFuncRe.test(nNode.value)) {
          const { nodes } = nNode;
          const [urlNode] = nodes;
          const url = urlNode?.type === "string" ? urlNode.value : valueParser.stringify(nodes);
          callback(url.replace(/^\s+|\s+$/g, ""), urlNode);
          continue;
        }
      }
    }
  });
};
