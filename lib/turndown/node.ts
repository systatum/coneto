import {
  isBlock,
  isVoid,
  hasVoid,
  isMeaningfulWhenBlank,
  hasMeaningfulWhenBlank,
} from "./utilities";

function Node(node: any, options: any): any {
  node.isBlock = isBlock(node);
  node.isCode = node.nodeName === "CODE" || node.parentNode?.isCode;
  node.isBlank = isBlank(node);
  node.flankingWhitespace = flankingWhitespace(node, options);
  return node;
}

function isBlank(node: any) {
  return (
    !isVoid(node) &&
    !isMeaningfulWhenBlank(node) &&
    /^\s*$/i.test(node.textContent) &&
    !hasVoid(node) &&
    !hasMeaningfulWhenBlank(node)
  );
}

function flankingWhitespace(node: any, options: any) {
  if (node.isBlock || (options.preformattedCode && node.isCode)) {
    return { leading: "", trailing: "" };
  }

  const edges = edgeWhitespace(node.textContent || "");

  if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) {
    edges.leading = edges.leadingNonAscii;
  }
  if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) {
    edges.trailing = edges.trailingNonAscii;
  }

  return { leading: edges.leading, trailing: edges.trailing };
}

function edgeWhitespace(string: string) {
  const m = string.match(
    /^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/
  ) || ["", "", "", "", "", "", ""];
  return {
    leading: m[1],
    leadingAscii: m[2],
    leadingNonAscii: m[3],
    trailing: m[4],
    trailingNonAscii: m[5],
    trailingAscii: m[6],
  };
}

function isFlankedByWhitespace(
  side: "left" | "right",
  node: any,
  options: any
) {
  let sibling, regExp;
  if (side === "left") {
    sibling = node.previousSibling;
    regExp = / $/;
  } else {
    sibling = node.nextSibling;
    regExp = /^ /;
  }

  if (sibling) {
    if (sibling.nodeType === 3) {
      return regExp.test(sibling.nodeValue);
    } else if (options.preformattedCode && sibling.nodeName === "CODE") {
      return false;
    } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
      return regExp.test(sibling.textContent);
    }
  }
  return false;
}

export default Node as unknown as {
  new (node: any, options: any): any;
};
