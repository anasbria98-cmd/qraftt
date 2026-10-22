import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("explicitly allows AI search crawlers without adding training-crawler rules", async () => {
  const source = await readFile(
    new URL("../app/robots.ts", import.meta.url),
    "utf8",
  );

  for (const userAgent of [
    "OAI-SearchBot",
    "Claude-SearchBot",
    "PerplexityBot",
  ]) {
    assert.match(source, new RegExp(`userAgent: "${userAgent}"`));
  }

  assert.match(source, /userAgent: "\*"/);
  assert.doesNotMatch(source, /userAgent: "(?:GPTBot|ClaudeBot|Google-Extended)"/);
});
