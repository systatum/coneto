import fs from "fs";
import path from "path";

const componentDir = path.resolve("./dist/components");
const styleImport = `import "./../shared.css";`;
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

    const lines = content.split("\n");
    const hasUseClient = lines[0].trim() === useClientDirective;
    const hasStyleImport = content.includes(styleImport);

    const newLines = [...lines];

    if (!hasUseClient) {
      newLines.unshift(useClientDirective);
    }

    if (!hasStyleImport) {
      const insertIndex = newLines[0] === useClientDirective ? 1 : 0;
      newLines.splice(insertIndex, 0, styleImport);
    }

    const finalContent = newLines.join("\n");
    fs.writeFileSync(fullPath, finalContent);
    console.log(`✅ Injected into: ${file}`);
  }
}
