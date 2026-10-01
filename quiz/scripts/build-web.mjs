import { copyFile, mkdir } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const outputDirectory = resolve(projectRoot, "www");
const webAssets = [
  "app.js",
  "daily-selection.js",
  "favicon.svg",
  "index.html",
  "manifest.webmanifest",
  "questions.js",
  "quran-verse-pack.js",
  "rules.js",
  "state-migration.js",
  "styles.css",
  "verse-content.js",
  "weekly-exam.js",
];

if (relative(projectRoot, outputDirectory) !== "www") {
  throw new Error("Refusing to build outside the project's www directory.");
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  webAssets.map((asset) => copyFile(resolve(projectRoot, asset), resolve(outputDirectory, basename(asset)))),
);

console.log(`Copied ${webAssets.length} web assets to ${outputDirectory}`);
