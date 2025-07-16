const fs = require("fs");
const path = require("path");

function getFlatExportsFrom(dirPath, baseDistPath) {
  const abs = path.join(__dirname, dirPath);

  return fs
    .readdirSync(abs)
    .filter(
      (f) =>
        (f.endsWith(".ts") || f.endsWith(".tsx")) &&
        !f.endsWith(".stories.tsx") &&
        !f.endsWith(".stories.ts")
    )
    .reduce((acc, file) => {
      const nameWithoutExt = path.basename(file, path.extname(file));
      const subpath = `./${nameWithoutExt.toLowerCase()}`;

      acc[subpath] = {
        import: `./dist/${baseDistPath}/${nameWithoutExt}.js`,
        types: `./dist/${baseDistPath}/${nameWithoutExt}.d.ts`,
      };

      return acc;
    }, {});
}

const componentsExports = getFlatExportsFrom("components", "components");

const pkgPath = path.join(__dirname, "package.json");
const pkg = require(pkgPath);

pkg.exports = {
  ".": {
    import: "./dist/index.js",
    types: "./dist/index.d.ts",
  },
  ...componentsExports,
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("✅ Flat exports generated (excluding .stories)");
