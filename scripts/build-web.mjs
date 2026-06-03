import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "www");
const files = ["index.html", "styles.css", "app.js", "favicon.svg", "manifest.webmanifest"];

await rm(outDir, { force: true, recursive: true });
await mkdir(outDir, { recursive: true });

await Promise.all(files.map((file) => cp(join(root, file), join(outDir, file))));

console.log(`Built ${files.length} web assets into www/`);
