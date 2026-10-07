import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = new URL("../", import.meta.url);
const assets = JSON.parse(readFileSync(new URL("docs/source-assets.json", root), "utf8"));
const publicFiles = new Set(["index.html", "styles.css", "app.js", "assets/favicon.svg", ...assets.assets.map((asset) => asset.file)]);
const contentTypes = { html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", png: "image/png", svg: "image/svg+xml" };

// Preview only: a strict allowlist keeps local drafts and repository metadata private.
export function createPreviewServer() {
  return createServer((request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    let url;
    let path;
    try {
      url = new URL(request.url, "http://127.0.0.1");
      path = decodeURIComponent(url.pathname).replace(/^\//, "") || "index.html";
    } catch {
      response.writeHead(400).end("Bad request");
      return;
    }
    if (!publicFiles.has(path)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }
    try {
      const body = readFileSync(new URL(path, root));
      const headers = {
        "Content-Type": contentTypes[path.split(".").at(-1)],
        "Content-Length": body.length,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      };
      if (path === "index.html" && url.searchParams.get("js") === "off") {
        headers["Content-Security-Policy"] = "script-src 'none'; object-src 'none'; base-uri 'none'";
      }
      response.writeHead(200, headers);
      response.end(request.method === "HEAD" ? undefined : body);
    } catch {
      response.writeHead(500).end("Unable to read preview file");
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 4174);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid port");
  const server = createPreviewServer();
  server.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}/ (no JavaScript: ?js=off)`));
}
