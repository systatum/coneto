import fs from "fs";
import path from "path";

const distDir = path.resolve("./dist");
const useClientDirective = `"use client";`;

/**
 * Resolve correct ESM path:
 * - ./file      -> ./file.js
 * - ../file     -> ../file.js
 * - ./folder    -> ./folder/index.js
 * - ../folder   -> ../folder/index.js
 */
function resolveImport(importPath, baseDir) {
  // already fully specified
  if (
    importPath.endsWith(".js") ||
    importPath.endsWith(".mjs") ||
    importPath.endsWith(".cjs") ||
    importPath.endsWith(".json")
  ) {
    return importPath;
  }

  const fullBase = path.resolve(baseDir, importPath);

  // file.js exists
  if (fs.existsSync(`${fullBase}.js`)) {
    return `${importPath}.js`;
  }

  // folder/index.js exists
  if (fs.existsSync(path.join(fullBase, "index.js"))) {
    return `${importPath}/index.js`;
  }

  // fallback
  return `${importPath}.js`;
}

function transformImports(content, fileDir) {
  /**
   * Matches:
   * import x from "./x"
   * import x from "../x"
   * export * from "./x"
   * export * from "../x"
   */

  const patterns = [
    {
      regex: /from\s+["']((?:\.\/|\.\.\/)[^"'?#]+)["']/g,
      replacer: (_, importPath) => {
        const resolved = resolveImport(importPath, fileDir);
        return `from "${resolved}"`;
      },
    },
    {
      /**
       * export * from "./x"
       * export * from "../x"
       */
      regex: /export\s+\*\s+from\s+["']((?:\.\/|\.\.\/)[^"'?#]+)["']/g,
      replacer: (_, importPath) => {
        const resolved = resolveImport(importPath, fileDir);
        return `export * from "${resolved}"`;
      },
    },
  ];

  for (const { regex, replacer } of patterns) {
    content = content.replace(regex, replacer);
  }

  return content;
}

function processFile(fullPath) {
  let content = fs.readFileSync(fullPath, "utf8").trim();
  const relativePath = path.relative(distDir, fullPath);

  // Prevent console.log in production build
  if (/console\.log\s*\(/.test(content)) {
    console.error(`❌ Build failed: console.log found in ${relativePath}`);
    process.exit(1);
  }

  // Inject "use client" only for component files, because hooks,
  // browser APIs, and interactive UI logic require Client Components
  // in Next.js App Router.
  const isComponent = fullPath.includes(`${path.sep}components${path.sep}`);
  if (isComponent) {
    let lines = content.split("\n");
    const hasUseClient = lines[0]?.trim() === useClientDirective;

    if (!hasUseClient) {
      lines.unshift(useClientDirective);
      content = lines.join("\n");
      console.log(`✅ Injected "use client" into: ${relativePath}`);
    }
  }

  // Fix ESM imports
  content = transformImports(content, path.dirname(fullPath));

  // Write final file
  fs.writeFileSync(fullPath, content);

  console.log(`✅ Processed: ${relativePath}`);
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (file.endsWith(".js")) {
      processFile(fullPath);
      console.log(`✅ Processed: ${path.relative(distDir, fullPath)}`);
    }
  }
}

if (!fs.existsSync(distDir)) {
  console.error(`❌ Folder not found: ${distDir}`);
  process.exit(1);
}

walk(distDir);

console.log("✨ Post-build processing complete");
