import fs from "fs";
import path from "path";

const distDir = path.resolve("./dist");
const useClientDirective = `"use client";`;

/**
 * Resolve correct ESM path:
 * - ./file      -> ./file.js
 * - ./folder    -> ./folder/index.js
 */
function resolveImport(importPath, baseDir) {
  const fullBase = path.resolve(baseDir, importPath);

  // already has extension → keep
  if (importPath.endsWith(".js")) return importPath;

  // file.js exists
  if (fs.existsSync(fullBase + ".js")) {
    return `${importPath}.js`;
  }

  // folder/index.js exists
  if (fs.existsSync(path.join(fullBase, "index.js"))) {
    return `${importPath}/index.js`;
  }

  // fallback (safe default)
  return `${importPath}.js`;
}

function transformImports(content, fileDir) {
  // handle: import ... from "..."
  content = content.replace(/from\s+["'](\.\/[^"']+)["']/g, (_, p1) => {
    const resolved = resolveImport(p1, fileDir);
    return `from "${resolved}"`;
  });

  // handle: export * from "..."
  content = content.replace(
    /export\s+\*\s+from\s+["'](\.\/[^"']+)["']/g,
    (_, p1) => {
      const resolved = resolveImport(p1, fileDir);
      return `export * from "${resolved}"`;
    }
  );

  return content;
}

function processFile(fullPath) {
  let content = fs.readFileSync(fullPath, "utf8").trim();

  // --- 1. Inject "use client" ONLY for components ---
  if (fullPath.includes(`${path.sep}components${path.sep}`)) {
    const lines = content.split("\n");
    const hasUseClient = lines[0].trim() === useClientDirective;

    if (!hasUseClient) {
      lines.unshift(useClientDirective);
      content = lines.join("\n");
    }
  }

  // --- 2. Fix ESM imports ---
  content = transformImports(content, path.dirname(fullPath));

  fs.writeFileSync(fullPath, content);
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".js")) {
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
