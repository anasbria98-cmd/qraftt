// Mechanical integration of explicit developer-owned display values, never form values.
import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";
const paths = {
  "components/generator/qr-type-selector.tsx": ["option.label", "selectedOption.label", "category", "selectedCategory", "activeCategory"],
  "components/generator/generator-customization.tsx": ["option.label", "template.label", "template.description", "frame.label", "level.label", "level.description", "warning", "uploadError", "name"],
  "components/pricing/pricing-comparison.tsx": ["plan.description"],
};
for (const [path, expressions] of Object.entries(paths)) {
  let source = readFileSync(path, "utf8");
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (ts.isJsxExpression(node) && node.expression && ts.isJsxElement(node.parent) && expressions.includes(node.expression.getText(tree))) {
      edits.push({ start: node.pos, end: node.end, text: `<T text={${node.expression.getText(tree)}} />` });
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  for (const edit of edits.sort((a,b) => b.start-a.start)) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  writeFileSync(path, source);
}
