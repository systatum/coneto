// **
//  * Storybook RSS Feed Generator
//  *
//  * Build-time script. Scans:
//  *   - components/**/*.stories.tsx
//  *   - components/**/*.mdx
//  *
//  * Outputs:
//  *   - public/feed.xml
//  *
//  * Behavior:
//  *   - Extracts Storybook meta.title
//  *   - Extracts rich descriptions (docs.description.component)
//  *   - Falls back to argTypes descriptions
//  *   - Parses welcome.mdx as authoritative channel metadata
//  *   - Uses filesystem timestamps for pubDate
//  *   - Strips markdown headings (#, ##) globally
//  *   - Converts markdown formatting to HTML inside CDATA blocks
//  *
//  * Execution:
//  *   node scripts/generate-rss.js
//  *

const fg = require("fast-glob");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ROOT = process.cwd();
const SITE_URL = "https://coneto.systatum.com";
const OUTPUT = "public/feed.xml";

const GLOB_PATTERNS = ["components/**/*.stories.tsx", "components/**/*.mdx"];

/**
 * Stable GUID generator.
 * Avoid using URL directly because Storybook paths may change.
 */
function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function escapeXml(input = "") {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(input = "") {
  return input.replace(/<[^>]+>/g, "");
}

/**
 * Produce a short plain-text summary suitable for <description>.
 * Input is raw (pre-cleanDescription) text — strip markdown first,
 * then collapse whitespace and take up to 3 sentences.
 */
function makeSummary(rawText = "") {
  const plain = rawText
    // Strip markdown headings
    .replace(/^\s*#{1,6}\s+/gm, "")
    // Strip bold/italic markers
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    // Strip bullet/list markers
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    // Collapse whitespace
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Take up to 3 sentences (split on ". " to avoid breaking decimals)
  const sentences = plain.split(/(?<=\.)\s+/);
  return sentences.slice(0, 3).join(" ").trim();
}

/**
 * Convert markdown-flavored text to safe HTML for use inside RSS CDATA blocks.
 *
 * Transformations (in order):
 *   1. Strip markdown headings (#, ##, ###, etc.) at line start
 *   2. Convert **bold** / __bold__ to <strong>
 *   3. Convert _text_ to underline span
 *   4. Convert unordered bullet lines into <ul><li>…</li></ul>
 *   5. Convert ordered list lines into <ol><li>…</li></ul>
 *   6. Convert remaining \n to <br/>
 *   7. Collapse excessive <br/> runs
 */

function cleanDescription(input = "") {
  let text = input;

  // 1. Strip markdown headings
  text = text.replace(/^\s*#{1,6}\s+/gm, "");

  // 2. Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // 3. Underline
  text = text.replace(
    /_(.+?)_/g,
    '<span style="text-decoration:underline">$1</span>'
  );

  // 4 & 5. List handling — group consecutive list lines into <ul> or <ol>
  const lines = text.split("\n");
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Unordered bullet
    if (/^\s*[-*•]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*[-*•]\s+/, "").trim();
        listItems.push(`<li>${itemText}</li>`);
        i++;
      }
      result.push(`<ul>${listItems.join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*\d+[.)]\s+/, "").trim();
        listItems.push(`<li>${itemText}</li>`);
        i++;
      }
      result.push(`<ol>${listItems.join("")}</ol>`);
      continue;
    }

    result.push(line);
    i++;
  }

  text = result.join("\n");

  // 6. Convert remaining newlines to <br/>, skip those adjacent to block tags
  text = text.replace(/\n(?!<\/?(?:ul|ol|li)>)(?!$)/g, "<br/>");

  // Remove spurious <br/> immediately before/after list blocks
  text = text.replace(/<br\/>(<(?:ul|ol)>)/g, "$1");
  text = text.replace(/(<\/(?:ul|ol)>)<br\/>/g, "$1");

  // 7. Collapse 3+ consecutive <br/> into two
  text = text.replace(/(<br\/>){3,}/g, "<br/><br/>");

  return text.trim();
}

/**
 * Extract meta from .stories.tsx using AST.
 */
function extractMetaFromStories(code) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const meta = {};

  traverse(ast, {
    VariableDeclarator(path) {
      if (path.node.id.type === "Identifier" && path.node.id.name === "meta") {
        const init = path.node.init;
        if (!init || init.type !== "ObjectExpression") return;

        for (const prop of init.properties) {
          if (prop.type !== "ObjectProperty") continue;

          const key = prop.key.name;

          // title: "Content/Avatar"
          if (key === "title" && prop.value.type === "StringLiteral") {
            meta.title = prop.value.value;
          }

          // parameters.docs.description.component
          if (key === "parameters" && prop.value.type === "ObjectExpression") {
            for (const p of prop.value.properties) {
              if (p.type !== "ObjectProperty") continue;
              if (p.key.name !== "docs") continue;
              if (p.value.type !== "ObjectExpression") continue;

              for (const dp of p.value.properties) {
                if (dp.type !== "ObjectProperty") continue;
                if (dp.key.name !== "description") continue;
                if (dp.value.type !== "ObjectExpression") continue;

                for (const dpp of dp.value.properties) {
                  if (dpp.type !== "ObjectProperty") continue;
                  if (dpp.key.name !== "component") continue;

                  if (dpp.value.type === "TemplateLiteral") {
                    meta.description = dpp.value.quasis
                      .map((q) => q.value.cooked)
                      .join("");
                  }
                }
              }
            }
          }
        }
      }
    },
  });

  return meta;
}

/**
 * Fallback: pull all "description: ..." fields from argTypes.
 */
function fallbackDescription(code) {
  const matches = [...code.matchAll(/description:\s*["`']([^"`']+)["`']/g)];
  return matches.map((m) => `- ${m[1]}`).join("\n");
}

/**
 * Extract metadata from MDX.
 */
function extractFromMDX(code) {
  const result = {};

  const metaMatch = code.match(/<Meta\s+title=["']([^"']+)["']/);
  if (metaMatch) {
    result.title = metaMatch[1].trim();
  }

  const sectionMatch = code.match(
    /<div[^>]*className=['"]sb-section-title['"][^>]*>([\s\S]*?)<\/div>/
  );

  if (sectionMatch) {
    let content = sectionMatch[1];
    content = content.replace(/<[^>]+>/g, "");
    result.description = content;
  }

  return result;
}

/**
 * Convert Storybook title into a stable URL slug.
 * "Content/Avatar" → "content-avatar"
 */
function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
}

/**
 * Build a single <item> block.
 *
 * @param {object} opts
 * @param {string} opts.title         - Display title
 * @param {string} opts.url           - Canonical link
 * @param {string} opts.guid          - Stable unique ID
 * @param {string} opts.rawDescription - Raw (markdown) description text
 * @param {Date}   opts.pubDate       - Last modified date
 */
function buildItem({ title, url, guid, rawDescription, pubDate }) {
  // <description> — short plain-text preview (3 sentences max)
  const summary = escapeXml(makeSummary(rawDescription));

  // <content:encoded> — full rich HTML inside CDATA (no escaping needed)
  const fullHtml = cleanDescription(rawDescription);

  return `
  <item>
    <title>${escapeXml(title)}</title>
    <link>${url}</link>
    <guid isPermaLink="false">${guid}</guid>
    <description><![CDATA[${summary}]]></description>
    <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
    <pubDate>${pubDate.toUTCString()}</pubDate>
  </item>`;
}

async function main() {
  const pkg = await fs.readJSON(path.join(ROOT, "package.json"));
  const version = pkg.version;

  const files = await fg(GLOB_PATTERNS);

  const items = [];

  let channelTitle = "Systatum Coneto React UI Library";
  let channelDescription = "Component documentation feed";
  let lastModified = new Date(0);

  for (const file of files) {
    const fullPath = path.join(ROOT, file);
    const code = await fs.readFile(fullPath, "utf-8");
    const stats = await fs.stat(fullPath);

    if (stats.mtime > lastModified) {
      lastModified = stats.mtime;
    }

    // MDX
    if (file.endsWith(".mdx")) {
      const mdx = extractFromMDX(code);

      if (!mdx.title) {
        mdx.title = path.basename(file, ".mdx");
      }

      if (!mdx.description) {
        mdx.description = code
          .replace(/<[^>]+>/g, "")
          .replace(/^\s*#+\s*/gm, "")
          .trim();
      }

      // Welcome.mdx → channel metadata only, not an item
      if (file.toLowerCase().endsWith("welcome.mdx")) {
        console.log("✅ FOUND WELCOME:", file);
        channelDescription = mdx.description || "";
        continue;
      }

      const slug = toSlug(mdx.title);

      items.push(
        buildItem({
          title: mdx.title,
          url: `${SITE_URL}/?path=/docs/${slug}`,
          guid: hash(file),
          rawDescription: mdx.description,
          pubDate: stats.mtime,
        })
      );

      continue;
    }

    /**
     * stories.tsx handling
     */
    const meta = extractMetaFromStories(code);
    if (!meta.title) continue;

    const description =
      meta.description || fallbackDescription(code) || "No description.";

    const slug = toSlug(meta.title);

    items.push(
      buildItem({
        title: `${meta.title.split("/").pop()} - Coneto React UI`,
        url: `${SITE_URL}/?path=/docs/${slug}`,
        guid: hash(file + meta.title),
        rawDescription: description,
        pubDate: stats.mtime,
      })
    );
  }

  /**
   * RSS 2.0 output
   * CDATA is used to preserve markdown-like content safely.
   */
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${makeSummary(channelDescription)}]]></description>
    <language>en</language>
    <generator>storybook-rss v${version}</generator>
    <lastBuildDate>${lastModified.toUTCString()}</lastBuildDate>
    ${items.join("\n")}
  </channel>
</rss>`;

  await fs.outputFile(path.join(ROOT, OUTPUT), rss);
  console.log(`✅ RSS generated at ${OUTPUT}`);
}

main();
