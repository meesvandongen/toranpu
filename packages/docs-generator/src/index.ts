import { parseFiles, isFunctionProp } from "@structured-types/api";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { combineFunctionProps } from "./function-render";
import {
  findAllCategories,
  getAllProps,
  hasCategory,
  sortProps,
  validateFunctionProps,
} from "./prop-utils";

const argv = yargs(hideBin(process.argv))
  .options({
    dir: { type: "string", default: ".", alias: "s" },
  })
  .parseSync();

const packagePath = path.join(argv.dir, "package.json");

if (!fs.existsSync(packagePath)) {
  console.error("No package.json found in src folder");
  process.exit(1);
}

const packageJsonRealPath = fs.realpathSync(packagePath);
const packageJson = JSON.parse(fs.readFileSync(packageJsonRealPath, "utf8"));

const packageName = packageJson.name;
globalThis.packageName = packageName;

if (!packageName) {
  console.error("No package name specified in package.json");
  process.exit(1);
}

const dest = packageJson.docs;

if (!dest) {
  console.error("No docs folder specified in package.json");
  process.exit(1);
}

if (typeof dest !== "string") {
  console.error("Docs folder must be a string");
  process.exit(1);
}

const src = packageJson.source;

if (!src) {
  console.error("No source file specified in package.json");
  process.exit(1);
}

const docObject = parseFiles([src]);
const allProps = getAllProps(docObject);

const functionProps = allProps.filter(isFunctionProp).sort(sortProps);

validateFunctionProps(functionProps);

// Find all categories
const categories = findAllCategories(functionProps);

const mdPerCategory = categories.map((category) => {
  const items = functionProps.filter(hasCategory.bind(null, category));
  const md = combineFunctionProps(items);
  return { category, md };
});

console.dir(mdPerCategory, { depth: null });

// Clear the current dist folder
// check if the folder exists
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true });
}
// Create the new dist folder, recursively
fs.mkdirSync(dest, { recursive: true });

mdPerCategory.forEach(({ category, md }) => {
  const categoryMdPath = path.join(dest, `${category}.md`);
  fs.writeFileSync(categoryMdPath, md);
  console.log(`Wrote ${categoryMdPath}`);
});

const readmeFilePath = path.join(argv.dir, "readme.md");

if (fs.existsSync(readmeFilePath)) {
  const readme = fs.readFileSync(readmeFilePath, "utf8");
  const readmeWithSidebar = `---\nsidebar_position: 1\n---\n${readme}`;
  const readmeDestPath = path.join(dest, "index.md");
  fs.writeFileSync(readmeDestPath, readmeWithSidebar);
  console.log(`Wrote ${readmeDestPath}`);
}
