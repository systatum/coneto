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
//  *
//  * Execution:
//  *   node scripts/generate-rss.js
//  *
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
 * Remove markdown heading markers and normalize whitespace.
 */
function cleanDescription(input = "") {
  return input
    .replace(/^\s*#+\s*/gm, "") // strip #, ##, ### at line start
    .replace(/\n{3,}/g, "\n\n") // collapse excessive spacing
    .trim();
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
          <guid>${hash(file)}</guid>
          <description><![CDATA[${cleanDescription(
            mdx.description
          )}]]></description>
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
        <guid>${guid}</guid>
        <description><![CDATA[${cleanDescription(description)}]]></description>
        <pubDate>${stats.mtime.toUTCString()}</pubDate>
      </item>
    `);
  }

  /**
   * RSS 2.0 output
   * CDATA is used to preserve markdown-like content safely.
   */
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${channelTitle}</title>
    <link>${SITE_URL}</link>
    <description>${channelDescription}</description>
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
