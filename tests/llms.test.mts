import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("llms.txt describes Qraftt factually with canonical URLs", async () => {
  const content = await readFile(
    new URL("../public/llms.txt", import.meta.url),
    "utf8",
  );

  assert.match(content, /^# Qraftt$/m);
  assert.match(content, /free browser-based static QR code generator/);
  assert.match(content, /30 QR types/);
  assert.match(content, /PNG and SVG export/);
  assert.match(content, /generated locally in the browser/);
  assert.match(content, /No signup, subscription, account/);
  assert.match(content, /do not depend on Qraftt after download/);
  assert.doesNotMatch(content, /vercel\.app|chatgpt\.site/);

  const urls = [...content.matchAll(/https:\/\/[^\s)]+/g)].map(
    ([url]) => url,
  );
  assert.ok(urls.length >= 10);
  assert.ok(urls.every((url) => new URL(url).hostname === "www.qraftt.com"));
});
