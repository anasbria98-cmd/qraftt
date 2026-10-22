// Isolated render-only fixtures. Never imported by the app or deployed as a route.
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import React from "react";
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../../", import.meta.url));
export function componentFixture(path, overrides = {}) {
  const modules = new Map();
  function load(filename) {
    const full = [filename, `${filename}.tsx`, `${filename}.ts`, `${filename}.js`].find(existsSync);
    if (!full) throw new Error(`Missing fixture module: ${filename}`);
    if (modules.has(full)) return modules.get(full).exports;
    const compiled = { exports: {} };
    modules.set(full, compiled);
    const code = ts.transpileModule(readFileSync(full, "utf8"), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText;
    const scopedRequire = name => {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name.endsWith(".css")) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
      if (name === "next/link") return { __esModule: true, default: ({ href, children, ...props }) => { delete props.prefetch; return React.createElement("a", { ...props, href }, children); } };
      if (name === "next/navigation") return { usePathname: () => "/dashboard/billing" };
      if (name === "@/lib/auth/actions") return { logout: async () => {} };
      if (name.startsWith("@/")) return load(resolve(root, name.slice(2)));
      if (name.startsWith(".")) return load(resolve(dirname(full), name));
      return require(name);
    };
    new Function("require", "module", "exports", code)(scopedRequire, compiled, compiled.exports);
    return compiled.exports;
  }
  return load(resolve(root, path));
}
