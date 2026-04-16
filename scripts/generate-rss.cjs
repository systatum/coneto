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

/**
 * Convert markdown-flavored text to safe HTML for use inside RSS CDATA blocks.
 *
 * Transformations (in order):
 *   1. Strip markdown headings (#, ##, ###, etc.) at line start
 *   2. Convert **bold** to <strong>bold</strong>
 *   3. Convert unordered bullet lines (-, *, •) into <ul><li>…</li></ul>
 *   4. Convert ordered list lines (1. 2. etc.) into <ol><li>…</li></ol>
 *   5. Convert remaining \n to <br/>
 *   6. Collapse excessive blank lines
 */
function cleanDescription(input = "") {
  let text = input;

  // 1. Strip markdown headings
  text = text.replace(/^\s*#{1,6}\s+/gm, "");

  // 2. Bold: **text** or __text__ → <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // 3. Underline: _text_ → <u>text</u>
  text = text.replace(
    /_(.+?)_/g,
    '<span style="text-decoration:underline">$1</span>'
  );

  // 4 & 5. List handling — group consecutive list lines into <ul> or <ol>
  //
  // Strategy: split into lines, walk through them, collect runs of list items,
  // then wrap each run in the appropriate tag.
  const lines = text.split("\n");
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Unordered bullet: starts with -, *, or •
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

    // Ordered list: starts with a number followed by . or )
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

  // 5. Convert remaining newlines to <br/>
  //    Skip newlines that are immediately adjacent to block-level HTML tags
  //    (<ul>, <ol>, <li>) to avoid spurious <br/> inside list markup.
  text = text.replace(/\n(?!<\/?(?:ul|ol|li)>)(?!$)/g, "<br/>");

  // Also remove leading <br/> that sneak in before/after list blocks
  text = text.replace(/<br\/>(<(?:ul|ol)>)/g, "$1");
  text = text.replace(/(<\/(?:ul|ol)>)<br\/>/g, "$1");

  // 6. Collapse 3+ consecutive <br/> into two
  text = text.replace(/(<br\/>){3,}/g, "<br/><br/>");

  return text.trim();
}

/**
 * Extract meta from .stories.tsx using AST.
 * Regex is avoided due to nested object complexity.
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

                  // Template literal (multi-line markdown)
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
 * Fallback extraction:
 * Pulls all "description: ..." fields from argTypes.
 * Produces a bullet-style text summary.
 */
function fallbackDescription(code) {
  const matches = [...code.matchAll(/description:\s*["`']([^"`']+)["`']/g)];
  return matches.map((m) => `- ${m[1]}`).join("\n");
}

/**
 * Extract metadata from MDX.
 * Assumes simple structure:
 *   <Meta title="..." />
 *   <div className="sb-section-title"> ... </div>
 */
function extractFromMDX(code) {
  const result = {};

  // Extract Meta title
  const metaMatch = code.match(/<Meta\s+title=["']([^"']+)["']/);
  if (metaMatch) {
    result.title = metaMatch[1].trim();
  }

  // Extract main descriptive block
  const sectionMatch = code.match(
    /<div[^>]*className=['"]sb-section-title['"][^>]*>([\s\S]*?)<\/div>/
  );

  if (sectionMatch) {
    let content = sectionMatch[1];

    /**
     * Remove JSX/HTML tags but preserve inner text.
     * This intentionally flattens formatting for RSS compatibility.
     */
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

async function main() {
  const pkg = await fs.readJSON(path.join(ROOT, "package.json"));
  const version = pkg.version;

  const files = await fg(GLOB_PATTERNS);

  const items = [];

  // Default channel metadata (overridden by Welcome.mdx)
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

    /**
     * MDX handling
     */
    if (file.endsWith(".mdx")) {
      const mdx = extractFromMDX(code);

      if (!mdx.title) {
        mdx.title = path.basename(file, ".mdx");
      }

      if (!mdx.description) {
        const stripped = code
          .replace(/<[^>]+>/g, "")
          .replace(/^\s*#+\s*/gm, "")
          .trim();

        mdx.description = stripped;
      }

      if (file.toLowerCase().endsWith("welcome.mdx")) {
        console.log("✅ FOUND WELCOME:", file);

        const cleanedDesc = cleanDescription(mdx.description || "");

        if (cleanedDesc) channelDescription = cleanedDesc;

        continue;
      } else {
        const slug = toSlug(mdx.title);

        items.push(`
          <item>
          <title>${mdx.title}</title>
          <link>${SITE_URL}/?path=/docs/${slug}</link>
          <guid isPermaLink="false">${hash(file)}</guid>
          <description><![CDATA[${cleanDescription(mdx.description)}]]></description>
          <content:encoded><![CDATA[
            ${cleanDescription(mdx.description)}
          ]]></content:encoded>
          <pubDate>${stats.mtime.toUTCString()}</pubDate>
          </item>
          `);

        continue;
      }
    }

    /**
     * stories.tsx handling
     */
    const meta = extractMetaFromStories(code);
    if (!meta.title) continue;

    const description =
      meta.description || fallbackDescription(code) || "No description";

    const slug = toSlug(meta.title);

    const url = `${SITE_URL}/?path=/docs/${slug}`;
    const guid = hash(file + meta.title);

    items.push(`
      <item>
        <title>${meta.title.split("/").pop()} - Coneto React UI</title>
        <link>${url}</link>
        <guid isPermaLink="false">${guid}</guid>
        <description><![CDATA[${cleanDescription(description)}]]></description>
        <content:encoded><![CDATA[
          ${cleanDescription(description)}
        ]]></content:encoded>
        <pubDate>${stats.mtime.toUTCString()}</pubDate>
      </item>
    `);
  }

  /**
   * RSS 2.0 output
   * CDATA is used to preserve markdown-like content safely.
   */
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${channelTitle}</title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${channelDescription}]]></description>
    <content:encoded><![CDATA[${channelDescription}]]></description>
    <language>en</language>
    <generator>storybook-rss v${version}</generator>
    <lastBuildDate>${lastModified.toUTCString()}</lastBuildDate>
    ${items.join("\n")}
  </channel>
</rss>`;

  await fs.outputFile(path.join(ROOT, OUTPUT), rss);

  console.log(`RSS generated at ${OUTPUT}`);
}

main();
