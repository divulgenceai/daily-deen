import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const outputDirectory = resolve(projectRoot, "www");
const magneticBundle = resolve(projectRoot, "qibla-magnetic.js");
const webAssets = [
  "app.js",
  "daily-selection.js",
  "feature-pages.css",
  "favicon.svg",
  "guide-content.js",
  "index.html",
  "manifest.webmanifest",
  "prayer-guide.html",
  "prayer-guide.js",
  "qibla.html",
  "qibla.js",
  "qibla-magnetic.js",
  "qibla-math.js",
  "qibla-sensors.js",
  "questions.js",
  "quran-verse-pack.js",
  "rules.js",
  "state-migration.js",
  "styles.css",
  "verse-content.js",
  "weekly-exam.js",
  "geomagnetism-LICENSE.txt",
];

if (relative(projectRoot, outputDirectory) !== "www") {
  throw new Error("Refusing to build outside the project's www directory.");
}

await mkdir(outputDirectory, { recursive: true });
await build({
  entryPoints: [resolve(projectRoot, "wmm-source.js")],
  outfile: magneticBundle,
  bundle: true,
  format: "esm",
  platform: "browser",
  minify: true,
  legalComments: "inline",
});
await Promise.all(webAssets.map(async (asset) => {
  const source = resolve(projectRoot, asset);
  const destination = resolve(outputDirectory, basename(asset));
  if (!asset.endsWith(".html")) {
    await copyFile(source, destination);
    return;
  }
  const html = await readFile(source, "utf8");
  const deploymentBase = '<base href="/quiz/" />';
  if (!html.includes(deploymentBase)) throw new Error(`Missing deployment base in ${asset}`);
  await writeFile(destination, html.replace(deploymentBase, '<base href="./" />'));
}));

console.log(`Copied ${webAssets.length} web assets to ${outputDirectory}`);
