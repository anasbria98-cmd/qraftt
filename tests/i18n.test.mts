import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { languages, detectLocale, resolveLocale, localeDirection, translate } from "../lib/i18n/locales.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("all 20 requested locales use primary language detection and explicit preference wins", () => {
  assert.equal(languages.length, 20);
  assert.equal(new Set(languages.map(language => language.code)).size, 20);
  assert.equal(detectLocale(["xx-XX", "fr-CA", "en-US"]), "fr");
  assert.equal(detectLocale(["zh-Hant-TW"]), "zh");
  assert.equal(detectLocale(["ar-MA"]), "ar");
  assert.equal(resolveLocale("en", ["ar"]), "en");
  assert.equal(resolveLocale("<invalid>", ["de-DE"]), "de");
  assert.equal(detectLocale([]), "en");
  assert.equal(detectLocale(["xx"]), "en");
});
test("only Arabic uses RTL and user variables are never translated recursively", () => {
  for (const language of languages) assert.equal(localeDirection(language.code), language.code === "ar" ? "rtl" : "ltr");
  const messages = { Email: "البريد الإلكتروني", "Destination: {value}": "الوجهة: {value}" };
  assert.equal(translate(messages, "Destination: {value}", { value: "Email" }), "الوجهة: Email");
  assert.equal(translate(messages, "Untranslated message"), "Untranslated message");
  assert.equal(translate(messages, "__proto__"), "__proto__");
});
test("19 lazy-loaded catalogs contain real translations for every shared core message", () => {
  const keys = JSON.parse(read("lib/i18n/core-messages.json"));
  assert.equal(keys.length, 108);
  for (const language of languages.filter(language => language.code !== "en")) {
    const catalog = JSON.parse(read(`public/locales/${language.code}.json`));
    for (const key of keys) assert.ok(Object.hasOwn(catalog, key), `${language.code}: ${key}`);
    assert.ok(Object.values(catalog).every(value => typeof value === "string" && value.length > 0));
    assert.notEqual(catalog["Choose language"], "Choose language", language.code);
  }
});
test("every extracted UI message has a nonempty translation with unchanged interpolation tokens", () => {
  const keys: string[] = JSON.parse(read("lib/i18n/ui-messages.json"));
  const tokens = (value: string) => [...value.matchAll(/\{\w+\}/g)].map(match => match[0]).sort();
  for (const language of languages.filter(language => language.code !== "en")) {
    const catalog = JSON.parse(read(`public/locales/${language.code}.json`));
    for (const key of keys) {
      assert.equal(typeof catalog[key], "string", `${language.code}: missing ${key}`);
      assert.ok(catalog[key].trim(), `${language.code}: empty ${key}`);
      assert.deepEqual(tokens(catalog[key]), tokens(key), `${language.code}: interpolation ${key}`);
    }
  }
});
test("translated preview labels never contain accidentally serialized JSX", () => {
  const source = read("components/generator/generator-customization.tsx");
  assert.doesNotMatch(source, /\$<T/);
  assert.match(source, /t\("Preview \{name\} frame"/);
});
test("homepage heading props and gallery titles are included in the catalog inventory", () => {
  const keys = new Set<string>(JSON.parse(read("lib/i18n/ui-messages.json")));
  for (const path of ["app/page.tsx", "components/marketing/use-case-gallery.tsx"]) {
    const tree = ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node: ts.Node) {
      if (ts.isStringLiteral(node)) {
        const parent = node.parent;
        if ((ts.isJsxAttribute(parent) && ["description", "eyebrow", "title"].includes(parent.name.getText(tree))) ||
          (ts.isPropertyAssignment(parent) && parent.name.getText(tree) === "title")) {
          assert.ok(keys.has(node.text), `${path}: ${node.text}`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
});
test("locale selection never routes, writes auth cookies, or sends content to a translation service", () => {
  const provider = read("components/i18n/language-provider.tsx");
  assert.match(provider, /fetch\(`\/locales\/\$\{locale\}\.json`/);
  assert.match(provider, /window\.localStorage\.setItem/);
  assert.match(provider, /navigator.languages/);
  assert.doesNotMatch(provider, /document\.cookie|router\.|location\.|supabase|paypal|innerHTML|MutationObserver/i);
  assert.doesNotMatch(read("lib/qr/payloads.ts"), /i18n|translate|useLanguage/);
});
