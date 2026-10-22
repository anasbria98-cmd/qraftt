// Mechanical extraction/wrapping of developer-authored UI text. Never reads user data or env files.
import ts from "typescript";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const messages = new Set(JSON.parse(readFileSync("lib/i18n/core-messages.json", "utf8")));
const files = [];
function scan(dir) { for (const entry of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, entry.name); if (entry.isDirectory()) scan(path); else if (path.endsWith(".tsx") && !["/i18n/", "/seo/", "/blog/", "/content/", "/brand/", "/ads/"].some(part => path.includes(part))) files.push(path); } }
scan("components"); scan("app");
const decode = value => value.replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/gi, (match, code) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" })[code] ?? (code[0] === "#" ? String.fromCodePoint(parseInt(code.slice(code[1]?.toLowerCase() === "x" ? 2 : 1), code[1]?.toLowerCase() === "x" ? 16 : 10)) : match));
function clean(value) {
  return decode(value.split(/\r\n|\n|\r/).map((line, i, lines) => {
    let text = line.replace(/\t/g, " ");
    if (i !== 0) text = text.replace(/^ +/, "");
    if (i !== lines.length - 1) text = text.replace(/ +$/, "");
    return text;
  }).filter(Boolean).join(" "));
}
const skipTags = new Set(["script", "style", "code", "pre", "T"]);
const staticAttributes = new Set(["label", "hint", "placeholder", "aria-label", "title", "alt"]);
const staticText = node => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || (ts.isConditionalExpression(node) && staticText(node.whenTrue) && staticText(node.whenFalse));
let changed = 0;
for (const path of files) {
  const source = readFileSync(path, "utf8");
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(tree) === "T") {
      const attr = node.attributes.properties.find(property => ts.isJsxAttribute(property) && property.name.getText(tree) === "text");
      if (attr?.initializer && ts.isStringLiteral(attr.initializer)) messages.add(attr.initializer.text);
      if (attr?.initializer && ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
        const expr = attr.initializer.expression;
        if (ts.isConditionalExpression(expr) && !staticText(expr)) edits.push({ start: node.getStart(tree), end: node.end, text: `{${expr.getText(tree)}}` });
        else if (staticText(expr)) { const gather = n => { if (ts.isStringLiteral(n)) messages.add(n.text); else ts.forEachChild(n, gather); }; gather(expr); }
      }
      return;
    }
    if (ts.isJsxElement(node) && skipTags.has(node.openingElement.tagName.getText(tree))) return;
    if (ts.isJsxAttribute(node) && staticAttributes.has(node.name.getText(tree)) && node.initializer && ts.isStringLiteral(node.initializer) && /[A-Za-z]{2}/.test(node.initializer.text)) messages.add(node.initializer.text);
    if (ts.isJsxText(node)) {
      const text = clean(node.text);
      const key = text.trim();
      if (/[A-Za-z]{2}/.test(key) && !/^https?:\/\//.test(key) && !/^[\w.+-]+@[\w.-]+$/.test(key)) {
        messages.add(key);
        edits.push({ start: node.pos, end: node.end, text: `${text.startsWith(" ") ? '{" "}' : ""}<T text=${JSON.stringify(key)} />${text.endsWith(" ") ? '{" "}' : ""}` });
      }
    }
    if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent) && !ts.isJsxSpreadAttribute(node.parent)) {
      const expr = node.expression;
      const literals = [];
      function collect(n) { if (ts.isStringLiteral(n)) literals.push(n.text); else ts.forEachChild(n, collect); }
      if (staticText(expr)) {
        collect(expr);
        if (literals.some(text => /[A-Za-z]{2}/.test(text))) {
          for (const text of literals) if (/[A-Za-z]{2}/.test(text)) messages.add(text);
          edits.push({ start: node.pos, end: node.end, text: `<T text={${expr.getText(tree)}} />` });
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  if (!edits.length) continue;
  let updated = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) updated = updated.slice(0, edit.start) + edit.text + updated.slice(edit.end);
  if (!/import[^;]*\bT\b[^;]*language-provider/.test(source)) {
    const firstImport = updated.indexOf("import ");
    const position = firstImport >= 0 ? firstImport : /^['"]use client['"];?/.test(updated) ? updated.indexOf("\n") + 1 : 0;
    updated = updated.slice(0, position) + 'import { T } from "@/components/i18n/language-provider";\n' + updated.slice(position);
  }
  writeFileSync(path, updated); changed++;
}
// Include human-facing strings in explicit UI data/config modules and validation messages.
for (const path of ["lib/qr/config.ts", "lib/auth/errors.ts", "lib/auth/actions.ts", "lib/pricing/plans.ts", "lib/qr/payloads.ts", "app/page.tsx", "components/account/auth-page.tsx", "components/account/dashboard-shell.tsx", "components/marketing/use-case-gallery.tsx", "components/marketing/qr-creation-steps.tsx"]) {
  const source = readFileSync(path, "utf8");
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(n) {
    if (ts.isStringLiteral(n) && n.text.includes(" ") && /[a-z]{3}/i.test(n.text) && !/[{}<>]|^\//.test(n.text) && !n.text.includes("@/") && !n.text.startsWith("https:")) {
      const parent = n.parent;
      if (!ts.isJsxAttribute(parent) || staticAttributes.has(parent.name.getText(tree))) messages.add(n.text);
    }
    if (ts.isJsxAttribute(n) && n.name.getText(tree) === "text" && n.initializer && ts.isStringLiteral(n.initializer)) messages.add(n.initializer.text);
    ts.forEachChild(n, visit);
  }
  visit(tree);
}
for (const privateOrTechnical of ["Supabase recovery failed", "Supabase signup failed", "PRODID:-//Qraft//Static QR Event//EN"]) messages.delete(privateOrTechnical);
messages.add("Language could not be loaded. Please try again.");
writeFileSync("lib/i18n/ui-messages.json", JSON.stringify([...messages].sort(), null, 2) + "\n");
console.log(JSON.stringify({ filesChanged: changed, messages: messages.size }));
