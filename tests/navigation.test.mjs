import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
function setup({ missingHeader = false, missingSection = false } = {}) {
  let scroll = 0;
  const events = {};
  const frames = [];
  const ids = ["dossier", "history", "architecture", "streaming"];
  const sections = ids.map((id, index) => ({ id, getBoundingClientRect: () => ({ top: 190 + index * 700 - scroll }) }));
  const links = ids.map((id) => ({ hash: `#${id}`, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; } }));
  const header = { getBoundingClientRect: () => ({ bottom: 88 }) };
  const document = {
    querySelector: (selector) => selector === ".site-header" ? (missingHeader ? null : header) : (missingSection ? null : sections.find((s) => `#${s.id}` === selector)),
    querySelectorAll: () => links,
  };
  const window = { addEventListener: (name, callback) => { events[name] = callback; }, requestAnimationFrame: (callback) => frames.push(callback) };
  runInNewContext(source, { document, window });
  return { links, events, frames, setScroll(value) { scroll = value; }, flush() { frames.splice(0).forEach((callback) => callback()); }, active() { return links.filter((l) => l.attributes["aria-current"]).map((l) => l.hash); } };
}

test("initial navigation and scroll activate exactly one chapter", () => {
  const page = setup();
  assert.deepEqual(page.active(), ["#dossier"]);
  for (const [scroll, expected] of [[800, "#history"], [1500, "#architecture"], [2400, "#streaming"], [0, "#dossier"]]) {
    page.setScroll(scroll);
    page.events.scroll();
    page.flush();
    assert.deepEqual(page.active(), [expected]);
  }
});

test("resize, restored positions and hash navigation update the same state", () => {
  const page = setup();
  page.setScroll(1600);
  page.events.load();
  assert.deepEqual(page.active(), ["#architecture"]);
  page.setScroll(2400);
  page.events.hashchange();
  page.events.resize();
  assert.equal(page.frames.length, 1, "events are throttled into one frame");
  page.flush();
  assert.deepEqual(page.active(), ["#streaming"]);
});

test("missing optional markup leaves the static page intact", () => {
  assert.deepEqual(setup({ missingHeader: true }).events, {});
  assert.deepEqual(setup({ missingSection: true }).events, {});
});
