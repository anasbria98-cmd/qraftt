// One-time draft catalog generation. Only extracted, developer-owned public UI copy is sent.
// This script is not imported by the application. Visitors never call a translation service.
import { readFileSync, writeFileSync } from "node:fs";
const keys = JSON.parse(readFileSync("lib/i18n/ui-messages.json", "utf8")).filter(key => key.trim());
const locales = ["fr", "ar", "es", "de", "it", "pt", "nl", "tr", "ru", "zh", "ja", "ko", "hi", "id", "ms", "vi", "pl", "uk", "ro"];
async function generate(locale) {
  const path = `public/locales/${locale}.json`;
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  const missing = keys.filter(key => !Object.hasOwn(catalog, key));
  const chunks = [];
  let chunk = [], size = 0;
  for (const key of missing) {
    if (size + key.length > 1600 && chunk.length) { chunks.push(chunk); chunk = []; size = 0; }
    chunk.push(key); size += key.length + 20;
  }
  if (chunk.length) chunks.push(chunk);
  for (const [batch, values] of chunks.entries()) {
    const query = values.map((key, index) => `ZXQ${index}QXZ ${key}`).join("\n");
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: locale, dt: "t", q: query });
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Translation stopped: ${locale} HTTP ${response.status}. No automatic retries.`);
    const data = await response.json();
    const result = data[0].map(segment => segment[0] ?? "").join("");
    const lines = result.split("\n").filter(line => line.trim());
    const valid = lines.length === values.length && lines.every((line, index) => {
      const markers = [...line.matchAll(/ZXQ\s*(\d+)\s*QXZ/g)];
      return markers.length === 1 && Number(markers[0][1]) === index && line.replace(markers[0][0], "").trim();
    });
    if (!valid) {
      // Never guess associations when Google rewrites markers: translate each entry separately.
      for (const key of values) {
        const single = new URL(url);
        single.searchParams.set("q", key);
        const answer = await fetch(single, { signal: AbortSignal.timeout(20000) });
        if (!answer.ok) throw new Error(`Translation stopped: HTTP ${answer.status}`);
        const payload = await answer.json();
        const value = payload[0].map(segment => segment[0] ?? "").join("").trim();
        if (!value) throw new Error("Empty individual translation");
        catalog[key] = value;
      }
    } else lines.forEach((line, index) => {
      const markers = [...line.matchAll(/ZXQ\s*(\d+)\s*QXZ/g)];
      if (markers.length !== 1 || Number(markers[0][1]) !== index) throw new Error("Translation order changed");
      const translated = line.replace(markers[0][0], "").trim();
      if (!translated) throw new Error(`Empty translation: ${locale} batch ${batch}`);
      catalog[values[index]] = translated;
    });
    writeFileSync(path, JSON.stringify(catalog, null, 2) + "\n");
    console.log(`${locale}: batch ${batch + 1}/${chunks.length}`);
  }
  writeFileSync(path, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`${locale}: ${keys.length} messages (${missing.length} added)`);
}
// Small, bounded concurrency; stop on any provider error rather than bypassing limits.
const queue = [...locales];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) await generate(queue.shift());
}));
