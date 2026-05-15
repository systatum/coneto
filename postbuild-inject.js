import fs from "fs";
import path from "path";

const componentDir = path.resolve("./dist/components");
const useClientDirective = `"use client";`;

if (!fs.existsSync(componentDir)) {
  console.error(`❌ Folder not found: ${componentDir}`);
  process.exit(1);
}

const files = fs.readdirSync(componentDir);
for (const file of files) {
  if (file.endsWith(".js")) {
    const fullPath = path.join(componentDir, file);
    let content = fs.readFileSync(fullPath, "utf8").trim();

    const hasConsoleLog = /console\.log\s*\(/.test(content);

    if (hasConsoleLog) {
      console.error(`❌ Build failed: console.log found in ${file}`);
      process.exit(1);
    }

    let lines = content.split("\n");
    const hasUseClient = lines[0].trim() === useClientDirective;

    if (!hasUseClient) {
      lines.unshift(useClientDirective);
    }

    const finalContent = lines.join("\n");
    fs.writeFileSync(fullPath, finalContent);
    console.log(`✅ Injected into: ${file}`);
  }
}
