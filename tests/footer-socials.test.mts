import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { siteConfig } from "../lib/site.ts";

test("footer social icons use the exact Qraftt URLs, accessible names and safe new tabs", () => {
  const { Footer } = componentFixture("components/layout/footer.tsx", {
    "@/components/i18n/language-provider": { T: ({ text }: { text: string }) => text },
    "@/components/privacy/cookie-settings-button": { CookieSettingsButton: () => createElement("button", { className: "footer-cookie-button", type: "button" }, "Cookie settings") },
    "@/components/brand/logo": { Logo: () => "Qraftt" },
    "next/image": { __esModule: true, default: () => null },
  });
  const html = renderToStaticMarkup(createElement(Footer));
  for (const [name, url] of [
    ["YouTube", "https://www.youtube.com/@qraftt.generator"],
    ["Facebook", "https://www.facebook.com/profile.php?id=61595929613573"],
    ["Facebook", "https://www.facebook.com/profile.php?id=61586264129845"],
  ]) {
    const tag = html.match(new RegExp(`<a href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`))?.[0];
    assert.ok(tag, name);
    assert.ok(tag.includes('target="_blank"'));
    assert.ok(tag.includes('rel="noopener noreferrer"'));
    assert.ok(tag.includes(`aria-label="Qraftt on ${name} (opens in a new tab)"`));
  }
  assert.equal((html.match(/focusable="false"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /instagram\.com|Qraftt on Instagram/);
  const socials = html.match(/<nav class="footer-socials"[^>]*>([\s\S]*?)<\/nav>/)![1];
  assert.deepEqual([...socials.matchAll(/href="([^"]+)"/g)].map(match => match[1]), [
    "https://www.youtube.com/@qraftt.generator",
    "https://www.facebook.com/profile.php?id=61595929613573",
    "https://www.facebook.com/profile.php?id=61586264129845",
  ]);
  assert.equal((socials.match(/d="M24 12a12 12/g) ?? []).length, 2);
  for (const [, href] of [...siteConfig.navigation, ...siteConfig.legalNavigation].filter(([, href]) => href !== "/contact")) {
    assert.equal(html.split(`href="${href}"`).length - 1, 1, href);
  }
  assert.match(html, /class="footer-link-group"><a href="\/privacy-policy"[\s\S]*?Cookie settings<\/button><\/div>/);
  assert.doesNotMatch(html, /href="\/contact"/);
  assert.match(html, /class="footer-contact"><h2>Contact<\/h2><a href="mailto:support@qraftt.com"/);
  assert.match(html, /aria-label="Qraftt social media"/);
  assert.match(html, /href="https:\/\/www.directree.io"/);
  assert.match(html, /Free to create. Free to share./);
});
