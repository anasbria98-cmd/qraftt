// Only developer-owned UI templates are sent; values are inserted locally at runtime.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
for(const file of readdirSync("public/locales").filter(file=>file.endsWith(".json"))) {
  const path=`public/locales/${file}`;
  const catalog=JSON.parse(readFileSync(path,"utf8"));
  for(const [key,value] of Object.entries(catalog)) {
    const placeholders=[...key.matchAll(/\{\w+\}/g)].map(match=>match[0]);
    const actual=[...value.matchAll(/\{\w+\}/g)].map(match=>match[0]);
    if(JSON.stringify([...placeholders].sort())===JSON.stringify(actual.sort()))continue;
    const protectedText=key.replace(/\{\w+\}/g,token=>String(91827000+placeholders.indexOf(token)));
    const url=new URL("https://translate.googleapis.com/translate_a/single");
    url.search=new URLSearchParams({client:"gtx",sl:"en",tl:file.replace(".json",""),dt:"t",q:protectedText});
    const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error(`Stopped: ${response.status}`);
    const data=await response.json();
    let text=data[0].map(segment=>segment[0]??"").join("");
    for(const [index,token] of placeholders.entries()) {
      const marker=String(91827000+index);
      if(!text.includes(marker))throw new Error(`Placeholder missing: ${file}`);
      text=text.replaceAll(marker,token);
    }
    catalog[key]=text;
  }
  writeFileSync(path,JSON.stringify(catalog,null,2)+"\n");
  console.log(`${file}: placeholders checked`);
}
