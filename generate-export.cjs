const fs = require("fs");
const path = require("path");

const IGNORED_COMPONENT_FILES = ["context-menu", "action-button"];

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
      if (
        IGNORED_COMPONENT_FILES.some((content) => content === nameWithoutExt)
      ) {
        return acc;
      }

      const subpath = `./${nameWithoutExt.toLowerCase()}`;

      acc[subpath] = {
        import: `./dist/${baseDistPath}/${nameWithoutExt}.js`,
        types: `./dist/${baseDistPath}/${nameWithoutExt}.d.ts`,
      };

      return acc;
    }, {});
}

const componentsExports = getFlatExportsFrom("components", "components");

const additionalExports = {
  "./constants/*": {
    import: "./dist/constants/*.js",
    types: "./dist/constants/*.d.ts",
  },
  "./code-color": {
    import: "./dist/lib/code-color.js",
    types: "./dist/lib/code-color.d.ts",
  },
  "./utils": {
    import: "./dist/lib/utils.js",
    types: "./dist/lib/utils.d.ts",
  },
};

const pkgPath = path.join(__dirname, "package.json");
const pkg = require(pkgPath);

pkg.exports = {
  ".": {
    import: "./dist/index.js",
    types: "./dist/index.d.ts",
  },
  ...componentsExports,
  ...additionalExports,
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("✅ Flat exports generated (excluding .stories)");
