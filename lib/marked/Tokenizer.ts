import { _defaults } from "./defaults";
import { rtrim, splitCells, findClosingBracket } from "./helpers";
import type { Rules } from "./rules.ts";
import type { _Lexer } from "./Lexer.ts";
import type { Links, Tokens, Token } from "./Tokens.ts";
import type { MarkedOptions } from "./MarkedOptions.ts";

function outputLink(
  cap: string[],
  link: Pick<Tokens.Link, "href" | "title">,
  raw: string,
  lexer: _Lexer,
  rules: Rules
): Tokens.Link | Tokens.Image {
  const href = link.href;
  const title = link.title || null;
  const text = cap[1].replace(rules.other.outputLinkReplace, "$1");

  lexer.state.inLink = true;
  const token: Tokens.Link | Tokens.Image = {
    type: cap[0].charAt(0) === "!" ? "image" : "link",
    raw,
    href,
    title,
    text,
    tokens: lexer.inlineTokens(text),
  };
  lexer.state.inLink = false;
  return token;
}

function indentCodeCompensation(raw: string, text: string, rules: Rules) {
  const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);

  if (matchIndentToCode === null) {
    return text;
  }

  const indentToCode = matchIndentToCode[1];

  return text
    .split("\n")
    .map((node) => {
      const matchIndentInNode = node.match(rules.other.beginningSpace);
      if (matchIndentInNode === null) {
        return node;
      }

      const [indentInNode] = matchIndentInNode;

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    })
    .join("\n");
}

/**
 * Tokenizer
 */
export class _Tokenizer {
  options: MarkedOptions;
  rules!: Rules; // set by the lexer
  lexer!: _Lexer; // set by the lexer

  constructor(options?: MarkedOptions) {
    this.options = options || _defaults;
  }

  space(src: string): Tokens.Space | undefined {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0],
      };
    }
  }

  code(src: string): Tokens.Code | undefined {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text,
      };
    }
  }

  fences(src: string): Tokens.Code | undefined {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "", this.rules);

      return {
        type: "code",
        raw,
        lang: cap[2]
          ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1")
          : cap[2],
        text,
      };
    }
  }

  heading(src: string): Tokens.Heading | undefined {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();

      // remove trailing #s
      if (this.rules.other.endingHash.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
          // CommonMark requires space before trailing #s
          text = trimmed.trim();
        }
      }

      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text),
      };
    }
  }

  hr(src: string): Tokens.Hr | undefined {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: rtrim(cap[0], "\n"),
      };
    }
  }

  blockquote(src: string): Tokens.Blockquote | undefined {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let lines = rtrim(cap[0], "\n").split("\n");
      let raw = "";
      let text = "";
      const tokens: Token[] = [];

      while (lines.length > 0) {
        let inBlockquote = false;
        const currentLines = [];

        let i;
        for (i = 0; i < lines.length; i++) {
          // get lines up to a continuation
          if (this.rules.other.blockquoteStart.test(lines[i])) {
            currentLines.push(lines[i]);
            inBlockquote = true;
          } else if (!inBlockquote) {
            currentLines.push(lines[i]);
          } else {
            break;
          }
        }
        lines = lines.slice(i);

        const currentRaw = currentLines.join("\n");
        const currentText = currentRaw
          // precede setext continuation with 4 spaces so it isn't a setext
          .replace(this.rules.other.blockquoteSetextReplace, "\n    $1")
          .replace(this.rules.other.blockquoteSetextReplace2, "");
        raw = raw ? `${raw}\n${currentRaw}` : currentRaw;
        text = text ? `${text}\n${currentText}` : currentText;

        // parse blockquote lines as top level tokens
        // merge paragraphs if this is a continuation
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        this.lexer.blockTokens(currentText, tokens, true);
        this.lexer.state.top = top;

        // if there is no continuation then we are done
        if (lines.length === 0) {
          break;
        }

        const lastToken = tokens.at(-1);

        if (lastToken?.type === "code") {
          // blockquote continuation cannot be preceded by a code block
          break;
        } else if (lastToken?.type === "blockquote") {
          // include continuation in nested blockquote
          const oldToken = lastToken as Tokens.Blockquote;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.blockquote(newText)!;
          tokens[tokens.length - 1] = newToken;

          raw =
            raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
          text =
            text.substring(0, text.length - oldToken.text.length) +
            newToken.text;
          break;
        } else if (lastToken?.type === "list") {
          // include continuation in nested list
          const oldToken = lastToken as Tokens.List;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.list(newText)!;
          tokens[tokens.length - 1] = newToken;

          raw =
            raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
          text =
            text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
          lines = newText.substring(tokens.at(-1)!.raw.length).split("\n");
          continue;
        }
      }

      return {
        type: "blockquote",
        raw,
        tokens,
        text,
      };
    }
  }

  list(src: string): Tokens.List | undefined {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;

      const list: Tokens.List = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: [],
      };

      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }

      // Get next list item
      const itemRegex = this.rules.other.listItemRegex(bull);
      let endsWithBlankLine = false;
      // Check if current bullet point can start a new List Item
      while (src) {
        let endEarly = false;
        let raw = "";
        let itemContents = "";
        if (!(cap = itemRegex.exec(src))) {
          break;
        }

        if (this.rules.block.hr.test(src)) {
          // End list if bullet was actually HR (possibly move into itemRegex?)
          break;
        }

        raw = cap[0];
        src = src.substring(raw.length);

        let line = cap[2]
          .split("\n", 1)[0]
          .replace(this.rules.other.listReplaceTabs, (t: string) =>
            " ".repeat(3 * t.length)
          );
        let nextLine = src.split("\n", 1)[0];
        let blankLine = !line.trim();

        let indent = 0;
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimStart();
        } else if (blankLine) {
          indent = cap[1].length + 1;
        } else {
          indent = cap[2].search(this.rules.other.nonSpaceChar); // Find first non-space char
          indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }

        if (blankLine && this.rules.other.blankLine.test(nextLine)) {
          // Items begin with at most one blank line
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }

        if (!endEarly) {
          const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
          const hrRegex = this.rules.other.hrRegex(indent);
          const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
          const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
          const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);

          // Check if following lines should be included in List Item
          while (src) {
            const rawLine = src.split("\n", 1)[0];
            let nextLineWithoutTabs;
            nextLine = rawLine;

            // Re-align to follow commonmark nesting rules
            if (this.options.pedantic) {
              nextLine = nextLine.replace(
                this.rules.other.listReplaceNesting,
                "  "
              );
              nextLineWithoutTabs = nextLine;
            } else {
              nextLineWithoutTabs = nextLine.replace(
                this.rules.other.tabCharGlobal,
                "    "
              );
            }

            // End list item if found code fences
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new heading
            if (headingBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of html block
            if (htmlBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new bullet
            if (nextBulletRegex.test(nextLine)) {
              break;
            }

            // Horizontal rule found
            if (hrRegex.test(nextLine)) {
              break;
            }

            if (
              nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >=
                indent ||
              !nextLine.trim()
            ) {
              // Dedent if possible
              itemContents += "\n" + nextLineWithoutTabs.slice(indent);
            } else {
              // not enough indentation
              if (blankLine) {
                break;
              }

              // paragraph continuation unless last line was a different block level element
              if (
                line
                  .replace(this.rules.other.tabCharGlobal, "    ")
                  .search(this.rules.other.nonSpaceChar) >= 4
              ) {
                // indented code block
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }

              itemContents += "\n" + nextLine;
            }

            if (!blankLine && !nextLine.trim()) {
              // Check if current line is blank
              blankLine = true;
            }

            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLineWithoutTabs.slice(indent);
          }
        }

        if (!list.loose) {
          // If the previous item ended with a blank line, the list is loose
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (this.rules.other.doubleBlankLine.test(raw)) {
            endsWithBlankLine = true;
          }
        }

        let istask: RegExpExecArray | null = null;
        let ischecked: boolean | undefined;
        // Check for task list items
        if (this.options.gfm) {
          istask = this.rules.other.listIsTask.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(
              this.rules.other.listReplaceTask,
              ""
            );
          }
        }

        list.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: [],
        });

        list.raw += raw;
      }

      // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
      const lastItem = list.items.at(-1);
      if (lastItem) {
        lastItem.raw = lastItem.raw.trimEnd();
        lastItem.text = lastItem.text.trimEnd();
      } else {
        // not a list since there were no items
        return;
      }
      list.raw = list.raw.trimEnd();

      // Item child tokens handled here at end because we needed to have the final item to trim it first
      for (let i = 0; i < list.items.length; i++) {
        this.lexer.state.top = false;
        list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);

        if (!list.loose) {
          // Check if list should be loose
          const spacers = list.items[i].tokens.filter(
            (t) => t.type === "space"
          );
          const hasMultipleLineBreaks =
            spacers.length > 0 &&
            spacers.some((t) => this.rules.other.anyLine.test(t.raw));

          list.loose = hasMultipleLineBreaks;
        }
      }

      // Set all items to loose if list is loose
      if (list.loose) {
        for (let i = 0; i < list.items.length; i++) {
          list.items[i].loose = true;
        }
      }

      return list;
    }
  }

  html(src: string): Tokens.HTML | undefined {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token: Tokens.HTML = {
        type: "html",
        block: true,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0],
      };
      return token;
    }
  }

  def(src: string): Tokens.Def | undefined {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag = cap[1]
        .toLowerCase()
        .replace(this.rules.other.multipleSpaceGlobal, " ");
      const href = cap[2]
        ? cap[2]
            .replace(this.rules.other.hrefBrackets, "$1")
            .replace(this.rules.inline.anyPunctuation, "$1")
        : "";
      const title = cap[3]
        ? cap[3]
            .substring(1, cap[3].length - 1)
            .replace(this.rules.inline.anyPunctuation, "$1")
        : cap[3];
      return {
        type: "def",
        tag,
        raw: cap[0],
        href,
        title,
      };
    }
  }

  table(src: string): Tokens.Table | undefined {
    const cap = this.rules.block.table.exec(src);
    if (!cap) {
      return;
    }

    if (!this.rules.other.tableDelimiter.test(cap[2])) {
      // delimiter row must have a pipe (|) or colon (:) otherwise it is a setext heading
      return;
    }

    const headers = splitCells(cap[1]);
    const aligns = cap[2]
      .replace(this.rules.other.tableAlignChars, "")
      .split("|");
    const rows = cap[3]?.trim()
      ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n")
      : [];

    const item: Tokens.Table = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: [],
    };

    if (headers.length !== aligns.length) {
      // header and align columns must be equal, rows can be different.
      return;
    }

    for (const align of aligns) {
      if (this.rules.other.tableAlignRight.test(align)) {
        item.align.push("right");
      } else if (this.rules.other.tableAlignCenter.test(align)) {
        item.align.push("center");
      } else if (this.rules.other.tableAlignLeft.test(align)) {
        item.align.push("left");
      } else {
        item.align.push(null);
      }
    }

    for (let i = 0; i < headers.length; i++) {
      item.header.push({
        text: headers[i],
        tokens: this.lexer.inline(headers[i]),
        header: true,
        align: item.align[i],
      });
    }

    for (const row of rows) {
      item.rows.push(
        splitCells(row, item.header.length).map((cell, i) => {
          return {
            text: cell,
            tokens: this.lexer.inline(cell),
            header: false,
            align: item.align[i],
          };
        })
      );
    }

    return item;
  }

  lheading(src: string): Tokens.Heading | undefined {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1]),
      };
    }
  }

  paragraph(src: string): Tokens.Paragraph | undefined {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text =
        cap[1].charAt(cap[1].length - 1) === "\n"
          ? cap[1].slice(0, -1)
          : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text),
      };
    }
  }

  text(src: string): Tokens.Text | undefined {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0]),
      };
    }
  }

  escape(src: string): Tokens.Escape | undefined {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: cap[1],
      };
    }
  }

  tag(src: string): Tokens.Tag | undefined {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (
        this.lexer.state.inLink &&
        this.rules.other.endATag.test(cap[0])
      ) {
        this.lexer.state.inLink = false;
      }
      if (
        !this.lexer.state.inRawBlock &&
        this.rules.other.startPreScriptTag.test(cap[0])
      ) {
        this.lexer.state.inRawBlock = true;
      } else if (
        this.lexer.state.inRawBlock &&
        this.rules.other.endPreScriptTag.test(cap[0])
      ) {
        this.lexer.state.inRawBlock = false;
      }

      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: false,
        text: cap[0],
      };
    }
  }

  link(src: string): Tokens.Link | Tokens.Image | undefined {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (
        !this.options.pedantic &&
        this.rules.other.startAngleBracket.test(trimmedUrl)
      ) {
        // commonmark requires matching angle brackets
        if (!this.rules.other.endAngleBracket.test(trimmedUrl)) {
          return;
        }

        // ending angle bracket cannot be escaped
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        // find closing parenthesis
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex === -2) {
          // more open parens than closed
          return;
        }

        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        // split pedantic href and title
        const link = this.rules.other.pedanticHrefTitle.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }

      href = href.trim();
      if (this.rules.other.startAngleBracket.test(href)) {
        if (
          this.options.pedantic &&
          !this.rules.other.endAngleBracket.test(trimmedUrl)
        ) {
          // pedantic allows starting angle bracket without ending angle bracket
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(
        cap,
        {
          href: href
            ? href.replace(this.rules.inline.anyPunctuation, "$1")
            : href,
          title: title
            ? title.replace(this.rules.inline.anyPunctuation, "$1")
            : title,
        },
        cap[0],
        this.lexer,
        this.rules
      );
    }
  }

  reflink(
    src: string,
    links: Links
  ): Tokens.Link | Tokens.Image | Tokens.Text | undefined {
    let cap;
    if (
      (cap = this.rules.inline.reflink.exec(src)) ||
      (cap = this.rules.inline.nolink.exec(src))
    ) {
      const linkString = (cap[2] || cap[1]).replace(
        this.rules.other.multipleSpaceGlobal,
        " "
      );
      const link = links[linkString.toLowerCase()];
      if (!link) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text,
        };
      }
      return outputLink(cap, link, cap[0], this.lexer, this.rules);
    }
  }

  emStrong(
    src: string,
    maskedSrc: string,
    prevChar = ""
  ): Tokens.Em | Tokens.Strong | undefined {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match) return;

    // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
    if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric))
      return;

    const nextChar = match[1] || match[2] || "";

    if (
      !nextChar ||
      !prevChar ||
      this.rules.inline.punctuation.exec(prevChar)
    ) {
      // unicode Regex counts emoji as 1 char; spread into array for proper count (used multiple times below)
      const lLength = [...match[0]].length - 1;
      let rDelim,
        rLength,
        delimTotal = lLength,
        midDelimTotal = 0;

      const endReg =
        match[0][0] === "*"
          ? this.rules.inline.emStrongRDelimAst
          : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;

      // Clip maskedSrc to same section of string as src (move to lexer?)
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim =
          match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

        if (!rDelim) continue; // skip single * in __abc*abc__

        rLength = [...rDelim].length;

        if (match[3] || match[4]) {
          // found another Left Delim
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          // either Left or Right Delim
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue; // CommonMark Emphasis Rules 9-10
          }
        }

        delimTotal -= rLength;

        if (delimTotal > 0) continue; // Haven't found enough closing delimiters

        // Remove extra characters. *a*** -> *a*
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        // char length can be >1 for unicode characters;
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(
          0,
          lLength + match.index + lastCharLength + rLength
        );

        // Create `em` if smallest delimiter has odd char count. *a***
        if (Math.min(lLength, rLength) % 2) {
          const text = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text),
          };
        }

        // Create 'strong' if smallest delimiter has even char count. **a***
        const text = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text,
          tokens: this.lexer.inlineTokens(text),
        };
      }
    }
  }

  codespan(src: string): Tokens.Codespan | undefined {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
      const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
      const hasSpaceCharsOnBothEnds =
        this.rules.other.startingSpaceChar.test(text) &&
        this.rules.other.endingSpaceChar.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      return {
        type: "codespan",
        raw: cap[0],
        text,
      };
    }
  }

  br(src: string): Tokens.Br | undefined {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0],
      };
    }
  }

  del(src: string): Tokens.Del | undefined {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2]),
      };
    }
  }

  autolink(src: string): Tokens.Link | undefined {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = cap[1];
        href = "mailto:" + text;
      } else {
        text = cap[1];
        href = text;
      }

      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text,
          },
        ],
      };
    }
  }

  url(src: string): Tokens.Link | undefined {
    let cap;
    if ((cap = this.rules.inline.url.exec(src))) {
      let text, href;
      if (cap[2] === "@") {
        text = cap[0];
        href = "mailto:" + text;
      } else {
        // do extended autolink path validation
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
        } while (prevCapZero !== cap[0]);
        text = cap[0];
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text,
          },
        ],
      };
    }
  }

  inlineText(src: string): Tokens.Text | undefined {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      const escaped = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        escaped,
      };
    }
  }
}
