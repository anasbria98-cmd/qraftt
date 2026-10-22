import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import sharp from "sharp";
import jsQR from "jsqr";
import {authOrigin} from "../lib/auth/origin.ts";
import {defaultDesign,bodyStyleOptions,outerEyeStyleOptions,innerEyeStyleOptions} from "../lib/qr/design.ts";
import {renderQrSvg,setSvgDimensions} from "../lib/qr/render.ts";

test("local auth callbacks preserve the review port but never trust external origins",()=>{
  const env={NODE_ENV:"development",AUTH_SITE_URL:"https://www.qraftt.com"};
  assert.equal(authOrigin(env,"http://localhost:3017"),"http://localhost:3017");
  assert.equal(authOrigin(env,"http://127.0.0.1:3017"),"http://127.0.0.1:3017");
  for(const origin of ["https://evil.test","http://localhost.evil.test","javascript:alert(1)"])assert.equal(authOrigin(env,origin),"https://www.qraftt.com");
  assert.equal(authOrigin({...env,NODE_ENV:"production"},"http://localhost:3017"),"https://www.qraftt.com");
});
test("early scripts stay inside head and pricing is in the sitemap",()=>{
  const layout=readFileSync(new URL("../app/layout.tsx",import.meta.url),"utf8");
  assert.ok(layout.indexOf("<head>")<layout.indexOf("<Script"));
  assert.ok(layout.indexOf("</head>")>layout.lastIndexOf("<Script"));
  assert.match(readFileSync(new URL("../app/sitemap.ts",import.meta.url),"utf8"),/siteConfig.url\}\/pricing/);
});
test("every custom body and finder-eye pair decodes at 512px",async()=>{
  const payload="https://example.com/audit";
  const designs=[...bodyStyleOptions.map(x=>({...defaultDesign,bodyStyle:x.value})),...outerEyeStyleOptions.flatMap(o=>innerEyeStyleOptions.map(i=>({...defaultDesign,outerEyeStyle:o.value,innerEyeStyle:i.value})))];
  for(const design of designs){
    const svg=setSvgDimensions(renderQrSvg(payload,"M",design),512);
    const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data,payload,JSON.stringify(design));
  }
});
