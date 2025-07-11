import COMMONMARK_RULES from "./commonmark-rules";
import Rules from "./rules";
import { extend, trimLeadingNewlines, trimTrailingNewlines } from "./utilities";
import RootNode from "./root-node";
import Node from "./node";

const reduce = Array.prototype.reduce;

const escapes: [RegExp, string][] = [
  [/\\/g, "\\\\"],
  [/\*/g, "\\*"],
  [/^-/g, "\\-"],
  [/^\+ /g, "\\+ "],
  [/^(=+)/g, "\\$1"],
  [/^(#{1,6}) /g, "\\$1 "],
  [/`/g, "\\`"],
  [/^~~~/g, "\\~~~"],
  [/\[/g, "\\["],
  [/\]/g, "\\]"],
  [/^>/g, "\\>"],
  [/[_]/g, "\\_"],
  [/^(\d+)\. /g, "$1\\. "],
];

interface TurndownServiceInstance {
  options: any;
  rules: any;
  turndown: (input: string | HTMLElement) => string;
  use: (plugin: Function | Function[]) => TurndownServiceInstance;
  addRule: (key: string, rule: any) => TurndownServiceInstance;
  keep: (filter: any) => TurndownServiceInstance;
  remove: (filter: any) => TurndownServiceInstance;
  escape: (str: string) => string;
}

function TurndownService(this: TurndownServiceInstance, options?: any) {
  if (!(this instanceof TurndownService))
    return new (TurndownService as any)(options);

  const defaults = {
    rules: COMMONMARK_RULES,
    headingStyle: "setext",
    hr: "* * *",
    bulletListMarker: "*",
    codeBlockStyle: "indented",
    fence: "```",
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
    br: "  ",
    preformattedCode: false,
    blankReplacement(content: string, node: any) {
      return node.isBlock ? "\n\n" : "";
    },
    keepReplacement(content: string, node: any) {
      return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
    },
    defaultReplacement(content: string, node: any) {
      return node.isBlock ? "\n\n" + content + "\n\n" : content;
    },
  };

  this.options = extend({}, defaults, options);
  this.rules = new Rules(this.options);
}

TurndownService.prototype = {
  turndown(this: TurndownServiceInstance, input: string | HTMLElement): string {
    if (!canConvert(input)) {
      throw new TypeError(
        input + " is not a string, or an element/document/fragment node."
      );
    }
    if (input === "") return "";
    const output = process.call(
      this,
      new (RootNode as any)(input, this.options)
    );
    return postProcess.call(this, output);
  },

  use(this: TurndownServiceInstance, plugin: Function | Function[]) {
    if (Array.isArray(plugin)) {
      plugin.forEach((p) => this.use(p));
    } else if (typeof plugin === "function") {
      plugin(this);
    } else {
      throw new TypeError("plugin must be a Function or an Array of Functions");
    }
    return this;
  },

  addRule(this: TurndownServiceInstance, key: string, rule: any) {
    this.rules.add(key, rule);
    return this;
  },

  keep(this: TurndownServiceInstance, filter: any) {
    this.rules.keep(filter);
    return this;
  },

  remove(this: TurndownServiceInstance, filter: any) {
    this.rules.remove(filter);
    return this;
  },

  escape(this: TurndownServiceInstance, str: string) {
    return escapes.reduce((acc, [regex, replacement]) => {
      return acc.replace(regex, replacement);
    }, str);
  },
};

function process(this: TurndownServiceInstance, parentNode: any): string {
  return reduce.call(
    parentNode.childNodes,
    (output: string, node: any) => {
      node = new (Node as any)(node, this.options);
      let replacement = "";
      if (node.nodeType === 3) {
        replacement = node.isCode
          ? node.nodeValue
          : this.escape(node.nodeValue);
      } else if (node.nodeType === 1) {
        replacement = replacementForNode.call(this, node);
      }
      return join(output, replacement);
    },
    ""
  );
}

function postProcess(this: TurndownServiceInstance, output: string) {
  this.rules.forEach((rule: any) => {
    if (typeof rule.append === "function") {
      output = join(output, rule.append(this.options));
    }
  });
  return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
}

function replacementForNode(this: TurndownServiceInstance, node: any): string {
  const rule = this.rules.forNode(node);
  let content = process.call(this, node);
  const whitespace = node.flankingWhitespace;
  if (whitespace.leading || whitespace.trailing) content = content.trim();
  return (
    whitespace.leading +
    rule.replacement(content, node, this.options) +
    whitespace.trailing
  );
}

function join(output: string, replacement: string) {
  const s1 = trimTrailingNewlines(output);
  const s2 = trimLeadingNewlines(replacement);
  const nls = Math.max(
    output.length - s1.length,
    replacement.length - s2.length
  );
  const separator = "\n\n".substring(0, nls);
  return s1 + separator + s2;
}

function canConvert(input: any) {
  return (
    input != null &&
    (typeof input === "string" ||
      (input.nodeType &&
        (input.nodeType === 1 ||
          input.nodeType === 9 ||
          input.nodeType === 11)))
  );
}

// ✅ Correct constructor cast
export default TurndownService as unknown as {
  new (options?: any): TurndownServiceInstance;
};
