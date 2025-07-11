import { repeat } from "./utilities";

interface NodeLike {
  nodeName: string;
  getAttribute: (name: string) => string | null;
  firstChild?: NodeLike & { textContent: string };
  parentNode?: NodeLike;
  nextSibling?: NodeLike;
  previousSibling?: NodeLike;
  lastElementChild?: NodeLike;
  children?: NodeLike[];
}

interface Options {
  headingStyle?: "setext" | "atx";
  codeBlockStyle?: "indented" | "fenced";
  emDelimiter?: string;
  strongDelimiter?: string;
  hr?: string;
  br?: string;
  bulletListMarker?: string;
  fence?: string;
  linkStyle?: "inlined" | "referenced";
  linkReferenceStyle?: "full" | "collapsed" | "shortcut";
}

interface Rule {
  filter: string | string[] | ((node: NodeLike, options: Options) => boolean);
  replacement: (content: string, node?: NodeLike, options?: Options) => string;
  append?: (options: Options) => string;
  references?: string[];
}

const cleanAttribute = (attribute: string | null): string =>
  attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";

const rules: Record<string, Rule> = {
  paragraph: {
    filter: "p",
    replacement: (content) => `\n\n${content}\n\n`,
  },

  lineBreak: {
    filter: "br",
    replacement: (_content, _node, options) => `${options?.br}\n`,
  },

  heading: {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content, node, options) => {
      const hLevel = Number(node!.nodeName.charAt(1));
      if (options?.headingStyle === "setext" && hLevel < 3) {
        const underline = repeat(hLevel === 1 ? "=" : "-", content.length);
        return `\n\n${content}\n${underline}\n\n`;
      }
      return `\n\n${"#".repeat(hLevel)} ${content}\n\n`;
    },
  },

  blockquote: {
    filter: "blockquote",
    replacement: (content) => {
      content = content.replace(/^\n+|\n+$/g, "").replace(/^/gm, "> ");
      return `\n\n${content}\n\n`;
    },
  },

  list: {
    filter: ["ul", "ol"],
    replacement: (content, node) => {
      const parent = node?.parentNode;
      if (parent?.nodeName === "LI" && parent.lastElementChild === node) {
        return `\n${content}`;
      }
      return `\n\n${content}\n\n`;
    },
  },

  listItem: {
    filter: "li",
    replacement: (content, node, options) => {
      content = content
        .replace(/^\n+/, "")
        .replace(/\n+$/, "\n")
        .replace(/\n/gm, "\n    ");
      let prefix = `${options?.bulletListMarker ?? "*"}   `;
      const parent = node?.parentNode;
      if (parent?.nodeName === "OL") {
        const start = parent.getAttribute("start");
        const index = Array.prototype.indexOf.call(parent.children, node);
        prefix = `${start ? Number(start) + index : index + 1}.  `;
      }
      return (
        prefix +
        content +
        (node?.nextSibling && !/\n$/.test(content) ? "\n" : "")
      );
    },
  },

  indentedCodeBlock: {
    filter: (node, options) =>
      options?.codeBlockStyle === "indented" &&
      node.nodeName === "PRE" &&
      node.firstChild?.nodeName === "CODE",

    replacement: (_content, node) =>
      `\n\n    ${node!.firstChild!.textContent.replace(/\n/g, "\n    ")}\n\n`,
  },

  fencedCodeBlock: {
    filter: (node, options) =>
      options?.codeBlockStyle === "fenced" &&
      node.nodeName === "PRE" &&
      node.firstChild?.nodeName === "CODE",

    replacement: (_content, node, options) => {
      const className = node!.firstChild!.getAttribute("class") || "";
      const language = (className.match(/language-(\S+)/) || [null, ""])[1];
      const code = node!.firstChild!.textContent;
      const fenceChar = options?.fence?.charAt(0) ?? "`";
      let fenceSize = 3;

      const fenceInCodeRegex = new RegExp(`^${fenceChar}{3,}`, "gm");
      let match;
      while ((match = fenceInCodeRegex.exec(code))) {
        if (match[0].length >= fenceSize) {
          fenceSize = match[0].length + 1;
        }
      }

      const fence = repeat(fenceChar, fenceSize);
      return `\n\n${fence}${language}\n${code.replace(/\n$/, "")}\n${fence}\n\n`;
    },
  },

  horizontalRule: {
    filter: "hr",
    replacement: (_content, _node, options) => `\n\n${options?.hr}\n\n`,
  },

  inlineLink: {
    filter: (node, options) =>
      options?.linkStyle === "inlined" &&
      node.nodeName === "A" &&
      !!node.getAttribute("href"),

    replacement: (content, node) => {
      let href = node!.getAttribute("href");
      if (href) href = href.replace(/([()])/g, "\\$1");
      const title = cleanAttribute(node!.getAttribute("title"));
      const titlePart = title ? ` "${title.replace(/"/g, '\\"')}"` : "";
      return `[${content}](${href}${titlePart})`;
    },
  },

  referenceLink: {
    filter: (node, options) =>
      options?.linkStyle === "referenced" &&
      node.nodeName === "A" &&
      !!node.getAttribute("href"),

    replacement(content, node, options) {
      const href = node!.getAttribute("href");
      const title = cleanAttribute(node!.getAttribute("title"));
      let replacement: string;
      let reference: string;

      switch (options?.linkReferenceStyle) {
        case "collapsed":
          replacement = `[${content}][]`;
          reference = `[${content}]: ${href} "${title}"`;
          break;
        case "shortcut":
          replacement = `[${content}]`;
          reference = `[${content}]: ${href} "${title}"`;
          break;
        default:
          const id = this.references!.length + 1;
          replacement = `[${content}][${id}]`;
          reference = `[${id}]: ${href} "${title}"`;
      }

      this.references!.push(reference);
      return replacement;
    },

    references: [],

    append() {
      if (!this.references?.length) return "";
      const refs = this.references.join("\n");
      this.references = [];
      return `\n\n${refs}\n\n`;
    },
  },

  emphasis: {
    filter: ["em", "i"],
    replacement: (content, _node, options) =>
      content.trim()
        ? `${options?.emDelimiter}${content}${options?.emDelimiter}`
        : "",
  },

  strong: {
    filter: ["strong", "b"],
    replacement: (content, _node, options) =>
      content.trim()
        ? `${options?.strongDelimiter}${content}${options?.strongDelimiter}`
        : "",
  },

  code: {
    filter: (node) => {
      const hasSiblings = !!(node.previousSibling || node.nextSibling);
      const isCodeBlock = node.parentNode?.nodeName === "PRE" && !hasSiblings;
      return node.nodeName === "CODE" && !isCodeBlock;
    },

    replacement: (content) => {
      if (!content) return "";
      content = content.replace(/\r?\n|\r/g, " ");
      let delimiter = "`";
      const matches = (content.match(/`+/g) || []) as string[];
      while (matches.includes(delimiter)) delimiter += "`";
      const extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
      return `${delimiter}${extraSpace}${content}${extraSpace}${delimiter}`;
    },
  },

  image: {
    filter: "img",
    replacement: (_content, node) => {
      const alt = cleanAttribute(node!.getAttribute("alt"));
      const src = node!.getAttribute("src") || "";
      const title = cleanAttribute(node!.getAttribute("title"));
      const titlePart = title ? ` "${title}"` : "";
      return src ? `![${alt}](${src}${titlePart})` : "";
    },
  },
};

export default rules;
