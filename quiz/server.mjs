import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number.parseInt(process.argv[2] || "4180", 10);
const host = process.argv[3] || "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("Port must be a number between 1 and 65535.");
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function safeFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const requested = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const candidate = resolve(root, requested);
  const fromRoot = relative(root, candidate);
  if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) return null;
  return candidate;
}

function localAddresses() {
  return Object.values(networkInterfaces())
    .flatMap((addresses) => addresses || [])
    .filter((address) => address.family === "IPv4" && !address.internal)
    .map((address) => address.address);
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    let filePath = safeFilePath(requestUrl.pathname);
    if (!filePath) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const fileStats = await stat(filePath).catch(() => null);
    if (fileStats?.isDirectory()) filePath = resolve(filePath, "index.html");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(body);
  } catch (error) {
    const notFound = error?.code === "ENOENT";
    response.writeHead(notFound ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(notFound ? "Not found" : "Server error");
  }
});

server.listen(port, host, () => {
  console.log("Daily Deen Quiz is running:");
  console.log(`  Local: http://localhost:${port}`);
  for (const address of localAddresses()) console.log(`  Device: http://${address}:${port}`);
});
