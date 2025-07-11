import collapseWhitespace from "./collapse-whitespace";
import HTMLParser from "./html-parser";
import { isBlock, isVoid } from "./utilities";

function RootNode(input: string | HTMLElement, options: any): HTMLElement {
  let root: HTMLElement;
  if (typeof input === "string") {
    const doc = htmlParser().parseFromString(
      '<x-turndown id="turndown-root">' + input + "</x-turndown>",
      "text/html"
    );
    root = doc.getElementById("turndown-root")!;
  } else {
    root = input.cloneNode(true) as HTMLElement;
  }

  collapseWhitespace({
    element: root,
    isBlock,
    isVoid,
    isPre: options.preformattedCode ? isPreOrCode : null,
  });

  return root;
}

function isPreOrCode(node: HTMLElement) {
  return node.nodeName === "PRE" || node.nodeName === "CODE";
}

let _htmlParser: any;
function htmlParser() {
  _htmlParser = _htmlParser || new HTMLParser();
  return _htmlParser;
}

export default RootNode as unknown as {
  new (input: string | HTMLElement, options: any): HTMLElement;
};
