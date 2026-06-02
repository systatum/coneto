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
//  *   - Uses filesystem timestamps for pubDate on NEW items only
//  *   - Preserves pubDate for items whose content hasn't changed
//  *   - Strips markdown headings (#, ##) globally
//  *   - Converts markdown formatting to HTML inside CDATA blocks
//  *   - Tracks content changes via coneto:item-digest (MD5 of content:encoded)
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

function escapeXml(input = "") {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Compute an MD5 hex digest of a string.
 */
function md5(input) {
  return crypto.createHash("md5").update(input, "utf8").digest("hex");
}

// ---------------------------------------------------------------------------
// Existing feed parsing — extract per-item {pubDate, digest} keyed by link
// ---------------------------------------------------------------------------

/**
 * Parse the existing feed.xml (if it exists) and return a Map of
 *   link → { pubDate: Date, digest: string }
 *
 * We use simple regex extraction — no full XML parser dependency needed
 * because we control the output format exactly.
 */
function loadExistingFeed(outputPath) {
  const fullPath = path.join(ROOT, outputPath);
  const existing = new Map(); // link → { pubDate, digest }

  if (!fs.existsSync(fullPath)) {
    return existing;
  }

  const xml = fs.readFileSync(fullPath, "utf-8");

  // Split into <item>...</item> blocks
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];

    const linkMatch = block.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);
    const digestMatch = block.match(
      /<coneto:item-digest>(.*?)<\/coneto:item-digest>/
    );

    if (!linkMatch) continue;

    const link = linkMatch[1].trim();
    const pubDate = pubDateMatch
      ? new Date(pubDateMatch[1].trim())
      : new Date(0);
    const digest = digestMatch ? digestMatch[1].trim() : "";

    existing.set(link, { pubDate, digest });
  }

  return existing;
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
 * Convert markdown-like text into structured HTML for RSS <content:encoded>.
 *
 * Goals:
 *   - Preserve meaning (especially code blocks / JSX)
 *   - Produce RSS-friendly HTML (block-based, not <br/> hacks)
 *   - Avoid unsafe HTML parsing issues
 *
 * Transformations (in order):
 *
 *   1. Extract code blocks (```...```)
 *      - Escape HTML (<, >, &)
 *      - Wrap in <pre><code> to prevent RSS stripping JSX (e.g. <Component />)
 *
 *   2. Normalize line endings
 *      - Convert CRLF → LF
 *      - Trim outer whitespace
 *
 *   3. Convert markdown headings (#, ##, etc.)
 *      - Transform into <h3> for consistent RSS rendering
 *
 *   4. Convert horizontal rules (---)
 *      - Transform into <hr/>
 *
 *   5. Convert inline formatting
 *      - **bold** / __bold__ → <strong>
 *      - _text_ → <em> (avoid underline for semantic correctness)
 *
 *   6. Convert lists
 *      - Group consecutive:
 *        - [- * •] → <ul><li>...</li></ul>
 *        - [1. / 1)] → <ol><li>...</li></ol>
 *
 *   7. Convert remaining text blocks
 *      - Non-empty lines → <p>...</p>
 *      - Empty lines → paragraph separation
 *
 *   8. Restore code blocks
 *      - Replace placeholders with <pre><code> blocks
 *
 * Result:
 *   - Clean, structured HTML
 *   - No reliance on <br/> for layout
 *   - Safe rendering in RSS readers
 */
function cleanDescription(input = "") {
  let text = input;

  // 1. Handle code block WITHOUT modifying content meaning
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code;

    return `<pre><code>${escaped}</code></pre>`;
  });

  // 2. Strip markdown headings
  text = text.replace(/^\s*#{1,6}\s+/gm, "");

  // 3. Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // 4. Underline
  text = text.replace(
    /_(.+?)_/g,
    '<span style="text-decoration:underline">$1</span>'
  );

  // 5. List handling — group consecutive list lines into <ul> or <ol>
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
 * @param {string} opts.title          - Display title
 * @param {string} opts.url            - Canonical link
 * @param {string} opts.guid           - Stable unique ID
 * @param {string} opts.rawDescription - Raw (markdown) description text
 * @param {Date}   opts.pubDate        - Publication date to use
 * @param {string} opts.digest         - MD5 of content:encoded
 */
function buildItem({ title, url, guid, rawDescription, pubDate, digest }) {
  // <description> — short plain-text preview (3 sentences max)
  const summary = escapeXml(makeSummary(rawDescription));

  // <content:encoded> — full rich HTML inside CDATA (no escaping needed)
  const fullHtml = cleanDescription(rawDescription);

  return `
  <item>
    <title>${escapeXml(title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${guid}</guid>
    <description><![CDATA[${summary}]]></description>
    <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
    <pubDate>${pubDate.toUTCString()}</pubDate>
    <coneto:item-digest>${digest}</coneto:item-digest>
  </item>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const pkg = await fs.readJSON(path.join(ROOT, "package.json"));
  const version = pkg.version;

  // Load existing feed so we can preserve pubDate for unchanged items
  const existingItems = loadExistingFeed(OUTPUT);

  const files = await fg(GLOB_PATTERNS);

  const items = [];

  let channelTitle = "Systatum Coneto React UI Library";
  let channelDescription = "Component documentation feed";
  let lastModified = new Date(0);

  for (const file of files) {
    const fullPath = path.join(ROOT, file);
    const code = await fs.readFile(fullPath, "utf-8");
    const stats = await fs.stat(fullPath);

    // MDX
    if (file.endsWith(".mdx")) {
      const mdx = extractFromMDX(code);

      if (!mdx.title) {
        mdx.title = path.basename(file, ".mdx");
      }

      if (!mdx.description) {
        mdx.description = code;
      }

      // Welcome.mdx → channel metadata only, not an item
      if (file.toLowerCase().endsWith("welcome.mdx")) {
        console.log("✅ FOUND WELCOME:", file);
        channelDescription =
          mdx.description
            .replace(/<[^>]+>/g, "")
            .replace(/^\s*#+\s*/gm, "")
            .trim() || "";
        continue;
      }

      const slug = toSlug(mdx.title);
      const url = `${SITE_URL}/?path=/docs/${slug}`;

      const fullHtml = cleanDescription(mdx.description);
      const newDigest = md5(fullHtml);

      const existing = existingItems.get(url);
      let pubDate;

      if (!existing) {
        // New item — use filesystem mtime
        pubDate = stats.mtime;
        console.log(`🆕 New item: ${url}`);
      } else if (existing.digest !== newDigest) {
        // Content changed — use filesystem mtime as updated date
        pubDate = stats.mtime;
        console.log(`✏️  Updated item: ${url}`);
      } else {
        // No change — preserve original pubDate
        pubDate = existing.pubDate;
      }

      // Track the most recent real change for lastBuildDate
      if (pubDate > lastModified) {
        lastModified = pubDate;
      }

      items.push(
        buildItem({
          title: mdx.title,
          url,
          guid: url,
          rawDescription: mdx.description,
          pubDate,
          digest: newDigest,
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
    const url = `${SITE_URL}/?path=/docs/${slug}`;

    const fullHtml = cleanDescription(description);
    const newDigest = md5(fullHtml);

    const existing = existingItems.get(url);
    let pubDate;

    if (!existing) {
      pubDate = stats.mtime;
      console.log(`🆕 New item: ${url}`);
    } else if (existing.digest !== newDigest) {
      pubDate = stats.mtime;
      console.log(`✏️  Updated item: ${url}`);
    } else {
      pubDate = existing.pubDate;
    }

    if (pubDate > lastModified) {
      lastModified = pubDate;
    }

    items.push(
      buildItem({
        title: `${meta.title.split("/").pop()} - Coneto React UI`,
        url,
        guid: url,
        rawDescription: description,
        pubDate,
        digest: newDigest,
      })
    );
  }

  // Fall back to now if we somehow have no items at all
  if (lastModified.getTime() === 0) {
    lastModified = new Date();
  }

  /**
   * RSS 2.0 output
   * xmlns:coneto is used for the coneto:item-digest extension element.
   * CDATA is used to preserve markdown-like content safely.
   */
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:coneto="https://coneto.systatum.com/rss/extensions">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${makeSummary(channelDescription)}]]></description>
    <language>en</language>
    <generator>storybook-rss v${version}</generator>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastModified.toUTCString()}</lastBuildDate>
    ${items.join("\n")}
  </channel>
</rss>`;

  await fs.outputFile(path.join(ROOT, OUTPUT), rss);
  console.log(`✅ RSS generated at ${OUTPUT}`);
}

main();
