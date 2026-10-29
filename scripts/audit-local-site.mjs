import { mkdir, writeFile } from 'node:fs/promises';
const origin = process.env.QRAFTT_AUDIT_ORIGIN ?? 'http://localhost:3017';
const report = { started: new Date().toISOString(), pages: [], protected: [], assets: [], errors: [] };
const xml = await (await fetch(origin + '/sitemap.xml')).text();
const paths = [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname).concat(['/pricing','/login','/signup','/forgot-password','/reset-password','/robots.txt','/ads.txt','/llms.txt']))];
const assets = new Set(), links = new Set();
async function check(path) {
  const start = performance.now();
  const r = await fetch(origin + path, {redirect:'manual'});
  const html = await r.text();
  const page = {path,status:r.status,ms:Math.round(performance.now()-start),bytes:Buffer.byteLength(html),title:html.match(/<title>(.*?)<\/title>/)?.[1],canonical:html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1],h1s:[...html.matchAll(/<h1\b/g)].length,jsonLd:[...html.matchAll(/application\/ld\+json/g)].length};
  report.pages.push(page);
  if(r.status>=400)report.errors.push(page);
  for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const value=m[1].replaceAll('&amp;','&');
    if(value.startsWith('/')&&!value.startsWith('//')) {
      if(/\.(?:png|jpg|jpeg|webp|svg|woff2?|css|js|ico)(?:\?|$)/.test(value))assets.add(value);
      else if(!value.startsWith('/_next/'))links.add(value.split('#')[0]);
    }
  }
}
for(let i=0;i<paths.length;i+=4)await Promise.all(paths.slice(i,i+4).map(check));
const protectedPaths=['/dashboard','/account',...['billing','my-qr-codes','statistics','import','archive','domains','api','support','faq'].map(s=>'/dashboard/'+s)];
for(const path of protectedPaths){const r=await fetch(origin+path,{redirect:'manual'});report.protected.push({path,status:r.status,location:r.headers.get('location')});}
for(const path of links)if(!paths.includes(path)&&!protectedPaths.includes(path)&&!path.startsWith('/api/')&&!path.startsWith('/auth/'))await check(path);
const assetList=[...assets];
for(let i=0;i<assetList.length;i+=8)await Promise.all(assetList.slice(i,i+8).map(async path=>{const r=await fetch(origin+path);const bytes=(await r.arrayBuffer()).byteLength; const row={path,status:r.status,bytes};report.assets.push(row);if(r.status>=400)report.errors.push(row);}));
report.finished=new Date().toISOString();
await mkdir('work/site-audit',{recursive:true});
await writeFile('work/site-audit/http.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:report.pages.length,protected:report.protected,assets:report.assets.length,errors:report.errors,largest:report.assets.toSorted((a,b)=>b.bytes-a.bytes).slice(0,5)},null,2));
