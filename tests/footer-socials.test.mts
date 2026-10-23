import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";

test("footer social icons use the exact Qraftt URLs, accessible names and safe new tabs", () => {
  const { Footer } = componentFixture("components/layout/footer.tsx", {
    "@/components/i18n/language-provider": { T: ({ text }: { text: string }) => text },
    "@/components/privacy/cookie-settings-button": { CookieSettingsButton: () => null },
    "@/components/brand/logo": { Logo: () => "Qraftt" },
    "next/image": { __esModule: true, default: () => null },
  });
  const html = renderToStaticMarkup(createElement(Footer));
  for (const [name, url] of [
    ["YouTube", "https://www.youtube.com/@qraftt.generator"],
    ["Facebook", "https://www.facebook.com/profile.php?id=61595929613573"],
    ["Instagram", "https://www.instagram.com/qraftt.generator/"],
  ]) {
    const tag = html.match(new RegExp(`<a href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`))?.[0];
    assert.ok(tag, name);
    assert.ok(tag.includes('target="_blank"'));
    assert.ok(tag.includes('rel="noopener noreferrer"'));
    assert.ok(tag.includes(`aria-label="Qraftt on ${name} (opens in a new tab)"`));
  }
  assert.equal((html.match(/focusable="false"/g) ?? []).length, 3);
});
