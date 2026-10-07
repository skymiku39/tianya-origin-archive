import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { createPreviewServer } from "../scripts/preview.mjs";

const root = new URL("../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");
const html = read("index.html");
const css = read("styles.css");
const manifest = JSON.parse(read("docs/source-assets.json"));
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

test("semantic static content and all previous anchors are retained", () => {
  assert.match(html, /<html lang="zh-Hant">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "duplicate IDs");
  for (const id of ["main", "top", "dossier", "history", "architecture", "streaming"]) assert.ok(ids.includes(id), id);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), target);
  for (const [, label] of html.matchAll(/aria-labelledby="([^"]+)"/g)) assert.ok(ids.includes(label), label);
  assert.doesNotMatch(html, /<dialog|<details|\shidden[\s=>]|\sinert[\s=>]|href="#"/);
  assert.match(html, /<main id="main" tabindex="-1">/);
});

test("copy stays within the approved scope and length", () => {
  const prose = [...html.matchAll(/<p[^>]*data-prose[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]*>/g, "")).join("");
  const count = [...prose.matchAll(/\p{Script=Han}/gu)].length;
  assert.ok(count >= 600 && count <= 800, `Chinese prose length: ${count}`);
  assert.match(prose, /以恩雅的人格為主導/);
  assert.match(prose, /緹亞接在恩雅背後/);
  assert.match(prose, /為了記錄作品的製作過程/);
  assert.doesNotMatch(html, /米拉|星之願|高冷|兩者人格自然融合|一起看看世界|遊戲直播|聊聊天/);
  assert.doesNotMatch(html, /\b175\b|\b35\b/, "working measurements do not become page canon");
});

test("every active asset exists; pixel dimensions, alt text and provenance agree", () => {
  const allowed = new Set(manifest.assets.map((asset) => asset.file));
  for (const [, tag] of html.matchAll(/<(img\b[^>]+)>/g)) {
    const image = attrs(tag);
    assert.ok(allowed.has(image.src), `unapproved image: ${image.src}`);
    assert.ok(image.alt?.length > 8);
    const bytes = readFileSync(new URL(image.src, root));
    assert.equal(bytes.readUInt32BE(16), Number(image.width), image.src);
    assert.equal(bytes.readUInt32BE(20), Number(image.height), image.src);
  }
  for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(#|https:)/.test(url)) continue;
    assert.ok(existsSync(new URL(url, root)), `missing ${url}`);
  }
  for (const asset of manifest.assets) {
    const bytes = readFileSync(new URL(asset.file, root));
    assert.equal(createHash("sha256").update(bytes).digest("hex").toUpperCase(), asset.sha256);
    assert.equal(bytes.readUInt32BE(16), asset.width);
    assert.equal(bytes.readUInt32BE(20), asset.height);
    if (asset.method === "byte-for-byte copy") assert.equal(asset.sha256, asset.source_sha256);
  }
});

test("sharing metadata uses the actual published original; no third-party runtime", () => {
  const tags = [...html.matchAll(/<meta\b[^>]+>/g)].map((m) => attrs(m[0]));
  const og = Object.fromEntries(tags.map((tag) => [tag.property || tag.name, tag.content]));
  assert.equal(og["og:image"], "https://skymiku39.github.io/tianya-origin-archive/assets/tianya-pixel-portrait.png");
  assert.equal(og["og:image:width"], "1920");
  assert.equal(og["twitter:card"], "summary_large_image");
  assert.doesNotMatch(html, /<script[^>]+src="https?:|<iframe|<form|fonts\.googleapis/);
  assert.doesNotMatch(css, /@import|https?:\/\//);
});

test("motion is optional and all reading is available without scripts", () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*html\s*\{\s*scroll-behavior:\s*auto/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /image-rendering:\s*pixelated/);
  assert.doesNotMatch(css, /@keyframes|animation:|opacity:\s*0\b/);
  assert.doesNotMatch(html, /<video|<audio|\.gif"|autoplay/);
  assert.doesNotMatch(read("app.js"), /innerHTML|createElement|localStorage|fetch\(|clipboard|remove\(/);
});

test("preview serves only public files, and can block JavaScript per response", async (t) => {
  const server = createPreviewServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const normal = await fetch(base);
  assert.equal(normal.status, 200);
  assert.equal(await normal.text(), html);
  const noJs = await fetch(`${base}/?js=off`);
  assert.match(noJs.headers.get("content-security-policy"), /script-src 'none'/);
  assert.equal(await noJs.text(), html);
  for (const path of [".git/config", "docs/CHARACTER-SPEC.md", "assets/previews/tia-pixel-study-v2.png", "missing.png"]) {
    const response = await fetch(`${base}/${path}`);
    assert.equal(response.status, 404, path);
    await response.text();
  }
  const image = await fetch(`${base}/assets/tia-original-still.png`);
  assert.equal(image.headers.get("content-type"), "image/png");
  await image.arrayBuffer();
});
