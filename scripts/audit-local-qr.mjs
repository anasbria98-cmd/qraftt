import { readFile,writeFile,mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { componentFixture } from '../tests/helpers/render-component.mjs';
const {buildQrPayload}=componentFixture('lib/qr/payloads.ts');
const {qrTypeOptions}=componentFixture('lib/qr/config.ts');
const {defaultDesign,designTemplates,frameOptions,bodyStyleOptions,outerEyeStyleOptions,innerEyeStyleOptions}=componentFixture('lib/qr/design.ts');
const {premiumTemplates}=componentFixture('lib/qr/premium-templates.ts');
const source=await readFile('tests/qr-payloads.test.mts','utf8');
const values=vm.runInNewContext('('+source.match(/const values: QrFormValues = ([\s\S]*?\n});/)[1]+')');
const report={types:[],designs:[],errors:[]};
async function render(payload,design,correction='M',format='png'){
 const r=await fetch('http://localhost:3017/api/qr/render',{method:'POST',headers:{origin:'http://localhost:3017','content-type':'application/json'},body:JSON.stringify({payload,design,correction,format,size:512})});
 const bytes=Buffer.from(await r.arrayBuffer());
 if(!r.ok)return{status:r.status,decoded:false};
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 return{status:r.status,decoded:jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data===payload};
}
for(const t of qrTypeOptions){const result=buildQrPayload(t.value,values);const png=await render(result.payload,defaultDesign),svg=await render(result.payload,defaultDesign,'M','svg');const row={type:t.value,payload:result.payload,error:result.error,png,svg};report.types.push(row);if(result.error||!png.decoded||!svg.decoded)report.errors.push(row);}
const cases=[...designTemplates.map(t=>({name:t.name,design:t.design,correction:t.errorCorrection})),...premiumTemplates.map(t=>({name:t.name,design:t.design,correction:'H'})),...frameOptions.map(t=>({name:'frame:'+t.value,design:{...defaultDesign,frame:t.value}})),...bodyStyleOptions.map(t=>({name:'body:'+t.value,design:{...defaultDesign,bodyStyle:t.value}})),...outerEyeStyleOptions.flatMap(o=>innerEyeStyleOptions.map(i=>({name:'eyes:'+o.value+'/'+i.value,design:{...defaultDesign,outerEyeStyle:o.value,innerEyeStyle:i.value}}))),{name:'gradient',design:{...defaultDesign,foreground:'#102a2a',gradientColor:'#256b4e'}},{name:'colors',design:{...defaultDesign,foreground:'#134e4a',outerEyeColor:'#134e4a',innerEyeColor:'#134e4a'}}];
for(const t of cases){const result=await render('https://example.com/audit',t.design,t.correction||'M');const row={name:t.name,...result};report.designs.push(row);if(!result.decoded)report.errors.push(row);}
await mkdir('work/site-audit',{recursive:true});await writeFile('work/site-audit/qr.json',JSON.stringify(report,null,2));console.log(JSON.stringify({types:report.types.length,designs:report.designs.length,errors:report.errors},null,2));
