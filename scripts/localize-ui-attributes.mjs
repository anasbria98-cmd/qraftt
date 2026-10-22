// Mechanical UI-only attribute conversion. Never changes input values or QR payloads.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import ts from "typescript";
import { socialQrConfig } from "../lib/qr/config.ts";
import { pricingBenefits, pricingPlans } from "../lib/pricing/plans.ts";
const files = [
  ["components/generator/generator-fields.tsx", "export function GeneratorFields"],
  ["components/generator/generator-customization.tsx", "export function GeneratorCustomization"],
  ["components/generator/qr-generator.tsx", "export function QrGenerator"],
  ["components/generator/qr-type-selector.tsx", "export function QrTypeSelector"],
];
for (const [path, declaration] of files) {
  let source = readFileSync(path, "utf8");
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (ts.isJsxAttribute(node) && ["placeholder", "aria-label", "title"].includes(node.name.getText(tree)) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const value = node.initializer.text;
      // Keep URL examples, personal example names and protocol hints untouched.
      if (/[a-z]+:|@|^#|^\d/.test(value) || !value.includes(" ")) return;
      edits.push({start:node.initializer.getStart(tree),end:node.initializer.end,text:`{t(${JSON.stringify(value)})}`});
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  if (!edits.length) continue;
  for (const edit of edits.sort((a,b)=>b.start-a.start)) source=source.slice(0,edit.start)+edit.text+source.slice(edit.end);
  source=source.replace('import { T } from "@/components/i18n/language-provider";', 'import { T, useLanguage } from "@/components/i18n/language-provider";');
  if (!source.includes("const { t } = useLanguage()")) {
    const start=source.indexOf(declaration);
    const body=source.indexOf(") {",start);
    if(start<0||body<0) throw new Error(`Missing function ${path}`);
    source=source.slice(0,body+3)+"\n  const { t } = useLanguage();"+source.slice(body+3);
  }
  writeFileSync(path,source);
}
// Extract display labels only from design data, never encoded content or render instructions.
const inventoryPath="lib/i18n/ui-messages.json";
const messages=new Set(JSON.parse(readFileSync(inventoryPath,"utf8")));
for(const benefit of pricingBenefits)messages.add(benefit.label);
for(const plan of pricingPlans)for(const value of Object.values(plan.benefits))if(typeof value==="string")messages.add(value);
for(const key of ["Free forever · no signup","Billed monthly","Billed yearly"])messages.add(key);
for(const path of ["lib/qr/design.ts", "lib/qr/config.ts", "app/(account)/dashboard/[section]/page.tsx"]) {
  const tree=ts.createSourceFile(path,readFileSync(path,"utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function visit(node) {
    if(ts.isPropertyAssignment(node)&&["label","description","title","detail","category"].includes(node.name.getText(tree))&&ts.isStringLiteral(node.initializer))messages.add(node.initializer.text);
    if(path==="lib/qr/design.ts"&&ts.isCallExpression(node)&&node.expression.getText(tree)==="template")for(const index of [1,2])if(node.arguments[index]&&ts.isStringLiteral(node.arguments[index]))messages.add(node.arguments[index].text);
    ts.forEachChild(node,visit);
  }
  visit(tree);
}
messages.add("{count} / 2,000 characters");
function collect(directory) {
  for (const entry of readdirSync(directory, {withFileTypes:true})) {
    const path=`${directory}/${entry.name}`;
    if(entry.isDirectory()) { collect(path); continue; }
    if(!path.endsWith(".tsx")) continue;
    const tree=ts.createSourceFile(path,readFileSync(path,"utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function visit(node) {
      if(ts.isCallExpression(node)&&["t","setPaywall"].includes(node.expression.getText(tree))&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0]))messages.add(node.arguments[0].text);
      if(ts.isJsxAttribute(node)&&["label","ariaLabel","hint"].includes(node.name.getText(tree))&&node.initializer&&ts.isStringLiteral(node.initializer))messages.add(node.initializer.text);
      if(ts.isJsxAttribute(node)&&node.name.getText(tree)==="text"&&node.initializer&&ts.isStringLiteral(node.initializer))messages.add(node.initializer.text);
      if(ts.isPropertyAssignment(node)&&["label","description"].includes(node.name.getText(tree))&&ts.isStringLiteral(node.initializer))messages.add(node.initializer.text);
      ts.forEachChild(node,visit);
    }
    visit(tree);
  }
}
collect("components");
for (const [type, config] of Object.entries(socialQrConfig)) {
  messages.add(`Enter a ${config.fieldLabel.toLowerCase()}.`);
  messages.add(`Enter a valid ${type} URL.`);
  messages.add(`Use a public URL on an official ${type} domain.`);
  messages.add(`Enter a valid ${type} username or official URL.`);
}
for(const label of ["latitude", "longitude"]) {
  messages.add(`Enter a ${label}.`); messages.add(`Enter a valid decimal ${label}.`);
}
for(const label of ["start", "end"])messages.add(`Enter a valid ${label} date and time.`);
for(const message of ["Latitude must be between -90 and 90.", "Longitude must be between -180 and 180.", "Keep text under 2,000 characters."])messages.add(message);
writeFileSync(inventoryPath,JSON.stringify([...messages].filter(x=>x.trim()).sort(),null,2)+"\n");
