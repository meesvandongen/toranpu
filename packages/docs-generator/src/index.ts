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
    src: { type: "string", default: ".", alias: "s" },
  })
  .parseSync();

// Get the package.json in the src folder
const packagePath = path.join(argv.src, "package.json");

if (!fs.existsSync(packagePath)) {
  console.error("No package.json found in src folder");
  process.exit(1);
}

const packageJsonRealPath = fs.realpathSync(packagePath);
const packageJson = JSON.parse(fs.readFileSync(packageJsonRealPath, "utf8"));

console.log(packageJson);

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

const src = packageJson.source;

if (!src) {
  console.error("No source file specified in package.json");
  process.exit(1);
}

console.log(argv);

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

// Clear the current dist folder
// check if the folder exists
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true });
}
// Create the new dist folder, recursively
fs.mkdirSync(dest, { recursive: true });

mdPerCategory.forEach(({ category, md }) => {
  fs.writeFileSync(`${dest}/${category}.md`, md);
});

// Copy the README.md, and add a sidebar position
const readme = fs.readFileSync("./readme.md", "utf8");
const readmeWithSidebar = `---\nsidebar_position: 1\n---\n${readme}`;

fs.writeFileSync(`${dest}/index.md`, readmeWithSidebar);
