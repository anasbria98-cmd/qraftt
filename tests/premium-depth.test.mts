import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("premium depth leaves the exact Qraftt logo source and styling untouched", () => {
  assert.equal(createHash("sha256").update(source("components/brand/logo.tsx")).digest("hex"), "2212e46410f5c4898f33164dd67cf8b8aebdf3f07ab4658b5690f488145427c3");
  const css = source("app/premium-depth.css").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(css, /\.brand(?:[\s.:{>-]|$)|\.brand-(?:mark|wordmark)|--(?:ink|mint|font-sans)\s*:/);
});

test("surface treatment cannot change layout, typography, QR pixels or template artwork", () => {
  const css = source("app/premium-depth.css").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(css, /(?:padding|margin|gap|display|font-size|font-family|font-weight|line-height|letter-spacing|grid-template-columns|flex-direction)\s*:/);
  assert.doesNotMatch(css, /\.design-gallery-preview|\.frame-gallery-preview|\.brand-mark|\.generator-canvas-wrap\s+canvas/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
});

test("detached decorative hero objects are absent from the theme and assets", () => {
  const css = source("app/premium-depth.css");
  assert.doesNotMatch(css, /\.home-hero::(?:before|after)|depth-object\.svg/);
  for (const name of ["qr-depth-object", "scan-depth-object"]) {
    const path = `public/images/ui/${name}.svg`;
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false);
  }
});

test("dimensional controls use one surface without hard offset copies", () => {
  const css = source("app/premium-depth.css");
  assert.match(css, /\.button-primary::after\s*\{\s*content:\s*none/);
  const tokens = [...css.matchAll(/--depth-(?:button|tile|card|panel):([^;]+);/g)];
  const levels = new Map([...css.matchAll(/(--depth-level-\d):([^;]+);/g)].map(([, name, value]) => [name, value]));
  assert.equal(levels.size, 5);
  assert.equal(tokens.length, 4);
  for (const [, token] of tokens) {
    const value = token.replace(/var\((--depth-level-\d)\)/g, (_, name) => levels.get(name)!);
    for (const shadow of value.split(",").filter(item => !item.includes("inset"))) {
      const lengths = [...shadow.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number(match[1]));
      assert.ok(lengths.length >= 2 && lengths[1] > 0, `Contact shadows must have real blur: ${shadow}`);
    }
  }
});

test("visual QA keeps controls upright and uses a single illustration shadow", () => {
  const css = source("app/premium-depth.css");
  assert.doesNotMatch(css, /rotate[XY]\(/);
  assert.match(css, /\.use-svg-panel, \.use-svg-card, \.step-svg-panel\s*\{\s*filter:\s*none/);
  assert.match(css, /\.view-all-types-button\s*\{\s*border-style:\s*solid/);
});

test("preview dialogs are centered and stay scrollable on short screens", () => {
  const css = source("app/globals.css");
  const rule = css.match(/\.style-preview-dialog\s*\{([^}]+)\}/)![1];
  assert.match(rule, /margin:\s*auto/);
  assert.match(rule, /max-height:\s*calc\(100dvh - 32px\)/);
  assert.match(rule, /overflow:\s*auto/);
  assert.match(source("components/generator/generator-customization.tsx"), /className="style-preview-dialog"/);
});

test("secondary surfaces complete the existing depth system without new effects or geometry", () => {
  const css = source("app/premium-depth.css");
  const completion = css.split("/* Completion:")[1].split("@media (hover:")[0];
  for (const selector of [".seo-faq-list summary", ".seo-related-grid a", ".footer-links a", ".mobile-preview-content button", ".style-preview-dialog", ".button-secondary:hover"]) {
    assert.ok(completion.includes(selector), `Missing secondary surface: ${selector}`);
  }
  assert.doesNotMatch(completion, /(?:padding|margin|gap|font-size|width|height|display|position)\s*:/);
  assert.doesNotMatch(completion, /backdrop-filter|keyframes|perspective\(|rotate[XY]\(/);
  assert.match(source("components/pricing/pricing.module.css"), /\.freeCard \.rows li\s*\{[^}]*background:/);
  assert.match(source("components/account/dashboard.module.css"), /\.table td a,\.table td button\s*\{[^}]*var\(--depth-surface\)/);
});

test("final polish shares field lighting and touch pressed surfaces without offset layers", () => {
  const css = source("app/premium-depth.css");
  const polish = css.split("/* Final polish:")[1].split("@media (hover:")[0];
  assert.match(polish, /\.use-case-card:hover, \.qr-step-card:hover\s*\{[^}]*var\(--depth-level-2\)/);
  assert.match(polish, /\.button:not\(:disabled\):active[\s\S]*var\(--depth-pressed\)/);
  assert.doesNotMatch(polish, /(?:content|position|width|height|padding|margin|gap)\s*:/);
  for (const path of ["components/account/auth.module.css", "components/account/account.module.css"]) {
    assert.ok(source(path).includes("background:var(--depth-field)"));
  }
  assert.match(source("components/pricing/pricing.module.css"), /\.freeCard \.cardHead\s*\{[^}]*background:var\(--depth-mint\)/);
  assert.match(source("app/globals.css"), /\.footer-socials\s*\{[^}]*margin-inline-start:\s*0;/);
});
