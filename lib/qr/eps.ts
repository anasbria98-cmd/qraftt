import { XMLParser } from "fast-xml-parser";
import svgpath from "svgpath";
import sharp from "sharp";
import { deflateSync } from "node:zlib";

// Internal SVG only: never accepts arbitrary SVG uploads, scripts or URLs.
// EPS Level 3 keeps QR geometry, gradients and frames as PostScript vectors.
// Logos/reference photographs remain embedded images, as in the source SVG.
type Node = { [name: string]: Node[] | Record<string, string> | string };
type Attr = Record<string, string>;
const numbers = (s = "") => (s.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
const num = (a: Attr, k: string, fallback = 0) => Number(a[k] ?? fallback);
function rgb(value: string, opacity = 1) {
  const color = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/.exec(value);
  if (color) return color.slice(1).map(v => 1 - opacity + opacity * Math.min(255, Number(v)) / 255);
  let hex = value === "white" ? "ffffff" : value === "black" ? "000000" : value.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  if (!/^[a-f\d]{6}$/i.test(hex)) throw new Error(`Unsupported EPS color: ${value}`);
  return [0, 2, 4].map(i => 1 - opacity + opacity * parseInt(hex.slice(i, i + 2), 16) / 255);
}
function geometry(tag: string, a: Attr): string | null {
  if (tag === "path") return a.d;
  if (tag === "line") return `M${num(a,"x1")} ${num(a,"y1")}L${num(a,"x2")} ${num(a,"y2")}`;
  if (tag === "polygon" || tag === "polyline") return `M${a.points}${tag === "polygon" ? "Z" : ""}`;
  if (tag === "ellipse") {
    const x=num(a,"cx"),y=num(a,"cy"),rx=num(a,"rx"),ry=num(a,"ry");
    return `M${x-rx} ${y}a${rx} ${ry} 0 1 0 ${rx*2} 0a${rx} ${ry} 0 1 0 ${-rx*2} 0Z`;
  }
  if (tag === "circle") {
    const x = num(a,"cx"), y = num(a,"cy"), r = num(a,"r");
    return `M${x-r} ${y}a${r} ${r} 0 1 0 ${r*2} 0a${r} ${r} 0 1 0 ${-r*2} 0Z`;
  }
  if (tag === "rect") {
    const x = num(a,"x"), y = num(a,"y"), w = num(a,"width"), h = num(a,"height");
    const rx = Math.min(num(a,"rx",num(a,"ry")),w/2), ry = Math.min(num(a,"ry",rx),h/2);
    return rx && ry ? `M${x+rx} ${y}h${w-2*rx}a${rx} ${ry} 0 0 1 ${rx} ${ry}v${h-2*ry}a${rx} ${ry} 0 0 1 ${-rx} ${ry}h${-w+2*rx}a${rx} ${ry} 0 0 1 ${-rx} ${-ry}v${-h+2*ry}a${rx} ${ry} 0 0 1 ${rx} ${-ry}Z` : `M${x} ${y}h${w}v${h}h${-w}Z`;
  }
  return null;
}
function pathCommands(d: string) {
  const output: string[] = []; let x = 0, y = 0, startX = 0, startY = 0;
  const path = svgpath(d).unshort().unarc().abs();
  path.iterate(segment => {
    const op = segment[0];
    const v: number[] = segment.slice(1) as number[];
    if (op === "M" || op === "L") { output.push(`${v.join(" ")} ${op === "M" ? "moveto" : "lineto"}`); [x,y] = v; if(op === "M") { startX=x; startY=y; } }
    else if (op === "H") { x=v[0]; output.push(`${x} ${y} lineto`); }
    else if (op === "V") { y=v[0]; output.push(`${x} ${y} lineto`); }
    else if (op === "C") { output.push(`${v.join(" ")} curveto`); [x,y]=v.slice(-2); }
    else if (op === "Q") { output.push(`${x+2/3*(v[0]-x)} ${y+2/3*(v[1]-y)} ${v[2]+2/3*(v[0]-v[2])} ${v[3]+2/3*(v[1]-v[3])} ${v[2]} ${v[3]} curveto`); [x,y]=v.slice(-2); }
    else if (op === "Z") { output.push("closepath"); x=startX; y=startY; }
    else throw new Error(`Unsupported EPS path command ${op}`);
  });
  return output.join("\n");
}
function pathBounds(d: string) {
  const xs: number[]=[], ys: number[]=[];
  svgpath(d).unshort().unarc().abs().iterate((segment, _index, x, y) => {
    const values=segment.slice(1) as number[];
    if(segment[0]==="H") { xs.push(values[0]); ys.push(y); }
    else if(segment[0]==="V") { xs.push(x); ys.push(values[0]); }
    else for(let i=0;i<values.length;i+=2) {xs.push(values[i]);ys.push(values[i+1]);}
  });
  const x=Math.min(...xs), y=Math.min(...ys);
  return [x,y,Math.max(...xs)-x,Math.max(...ys)-y];
}
function transform(s = "") {
  return [...s.matchAll(/(translate|scale|rotate|matrix)\s*\(([^)]+)\)/g)].map(([,op,args]) => {
    const v=numbers(args);
    if (op === "matrix") return `[${v.join(" ")}] concat`;
    if (op === "translate") return `${v[0]} ${v[1] ?? 0} translate`;
    if (op === "scale") return `${v[0]} ${v[1] ?? v[0]} scale`;
    return v.length === 3 ? `${v[1]} ${v[2]} translate ${v[0]} rotate ${-v[1]} ${-v[2]} translate` : `${v[0]} rotate`;
  }).join("\n");
}
export async function svgToEps(svg: string) {
  if (/<!DOCTYPE|<!ENTITY/i.test(svg)) throw new Error("Unsupported SVG.");
  const tree = new XMLParser({ ignoreAttributes: false, preserveOrder: true, processEntities: true }).parse(svg) as Node[];
  const definitions = new Map<string, Node>();
  function collect(nodes: Node[]) { for (const n of nodes) { const a=n[":@"] as Attr|undefined; if(a?.["@_id"]) definitions.set(a["@_id"],n); for(const [k,v] of Object.entries(n)) if(k!==":@"&&Array.isArray(v)) collect(v); } }
  collect(tree);
  function attrs(n: Node) { return Object.fromEntries(Object.entries((n[":@"]??{}) as Attr).map(([k,v])=>[k.replace(/^@_/,""),String(v)])); }
  const root=tree.find(n=>n.svg); if(!root)throw new Error("Missing SVG.");
  const rootAttr=attrs(root), [vx,vy,vw,vh]=numbers(rootAttr.viewBox);
  const page=426; // 150 mm, matching the PDF export.
  const out=["%!PS-Adobe-3.0 EPSF-3.0",`%%BoundingBox: 0 0 ${page} ${page}`,"%%LanguageLevel: 3","%%Pages: 1","%%EndComments","gsave",`0 ${page} translate ${page/vw} ${-page/vh} scale ${-vx} ${-vy} translate`];
  async function draw(nodes: Node[], inherited: Attr = {}, depth=0, clip=false) {
    if(depth>30)throw new Error("Vector nesting too deep.");
    for(const n of nodes) {
      const tag=Object.keys(n).find(k=>k!==":@"); if(!tag || tag==="#text")continue;
      const own=attrs(n), a={...inherited,...own}, children=(n[tag]??[]) as Node[];
      if(["defs","clipPath","linearGradient","radialGradient","stop"].includes(tag))continue;
      if(!clip)out.push("gsave");
      out.push(transform(own.transform));
      // EPS has no standard fractional-alpha compositing. The supplied jigsaw
      // artwork uses a translucent nested image over each finder eye. Flatten
      // that tiny artwork region against the final SVG scene, not against white
      // (which would erase the dark finder bars). QR body geometry stays vector.
      if(tag === "svg" && own.viewBox && Number(own.opacity ?? 1) < 1) {
        const x=num(own,"x"), y=num(own,"y"), w=num(own,"width"), h=num(own,"height");
        const crop=svg.replace(/viewBox="[^"]*"/,`viewBox="${x} ${y} ${w} ${h}"`).replace(/width="[^"]*"/, 'width="512"').replace(/height="[^"]*"/, 'height="512"');
        const image=await sharp(Buffer.from(crop),{limitInputPixels:16_000_000}).png().toBuffer();
        await draw([{image:[], ":@":{"@_href":`data:image/png;base64,${image.toString("base64")}`,"@_x":String(x),"@_y":String(y),"@_width":String(w),"@_height":String(h)}}],{},depth+1);
        out.push("grestore"); continue;
      }
      if(tag==="svg" && own.viewBox) {
        const [x,y,w,h]=numbers(own.viewBox), width=num(own,"width",w),height=num(own,"height",h);
        out.push(`${num(own,"x")} ${num(own,"y")} translate`);
        if(own.overflow==="hidden")out.push(`newpath 0 0 moveto ${width} 0 lineto ${width} ${height} lineto 0 ${height} lineto closepath clip newpath`);
        out.push(`${width/w} ${height/h} scale ${-x} ${-y} translate`);
      }
      const cp=own["clip-path"]?.match(/^url\(#([^)]*)\)$/)?.[1];
      if(cp) { const c=definitions.get(cp); if(!c)throw new Error("Missing clip."); out.push("newpath"); await draw(c.clipPath as Node[],{},depth+1,true); out.push("clip newpath"); }
      if(tag==="use") {
        const id=(own.href??own["xlink:href"]??"").replace(/^#/,""); const node=definitions.get(id); if(!node)throw new Error("Missing SVG reference.");
        out.push(`${num(own,"x")} ${num(own,"y")} translate`); await draw([node],inherited,depth+1,clip);
      } else if(tag==="g"||tag==="svg") {
        const next={...a}; for(const k of ["transform","clip-path","x","y","viewBox","width","height","id"])delete next[k];
        await draw(children,next,depth+1,clip);
      } else if(tag==="image") {
        const href=own.href??own["xlink:href"]??"";
        if(!/^data:image\/(png|jpeg|webp);base64,/.test(href))throw new Error("External images are not permitted.");
        const buffer=Buffer.from(href.slice(href.indexOf(",")+1),"base64");
        const {data,info}=await sharp(buffer,{limitInputPixels:16_000_000}).flatten({background:"#ffffff"}).removeAlpha().toColourspace("srgb").raw().toBuffer({resolveWithObject:true});
        const alpha=Number(a.opacity??1); const pixels=alpha<1?Buffer.from(data.map(v=>Math.round(255+(v-255)*alpha))):data;
        let w=num(own,"width"),h=num(own,"height"),x=num(own,"x"),y=num(own,"y");
        if(own.preserveAspectRatio!=="none") {const scale=Math.min(w/info.width,h/info.height);x+=(w-info.width*scale)/2;y+=(h-info.height*scale)/2;w=info.width*scale;h=info.height*scale;}
        out.push(`${x} ${y} translate ${w} ${h} scale`,"/DeviceRGB setcolorspace",`<< /ImageType 1 /Width ${info.width} /Height ${info.height} /BitsPerComponent 8 /Decode [0 1 0 1 0 1] /ImageMatrix [${info.width} 0 0 ${-info.height} 0 ${info.height}] /DataSource currentfile /ASCIIHexDecode filter /FlateDecode filter >> image`,deflateSync(pixels).toString("hex"),">");
      } else if(tag==="text") {
        const text=children.map(c=>c["#text"]??"").join("");
        if(/[^\x20-\x7e]/.test(text))throw new Error("EPS text currently requires a Latin printable frame label. Use SVG/PDF for other scripts.");
        const value=text.replace(/[()\\]/g,"\\$&"), size=num(a,"font-size",16);
        out.push(`${rgb(a.fill??"#000",Number(a.opacity??1)).join(" ")} setrgbcolor`,`${num(a,"x")} ${num(a,"y")} translate 1 -1 scale /Helvetica-Bold findfont ${size} scalefont setfont 0 0 moveto (${value})`);
        const spacing = num(a,"letter-spacing");
        if(a["text-anchor"]==="middle")out.push(`dup stringwidth pop ${Math.max(0,text.length-1)*spacing} add -2 div 0 rmoveto`);
        out.push(`${spacing} 0 3 -1 roll ashow`);
      } else {
        const d=geometry(tag,a); if(!d)throw new Error(`Unsupported SVG element: ${tag}`);
        const path=pathCommands(d); if(clip) {out.push(path);continue;}
        const fill=a.fill??"#000000",stroke=a.stroke??"none";
        if(fill!=="none") {
          out.push("newpath",path);
          const id=fill.match(/^url\(#([^)]*)\)$/)?.[1];
          if(id) {
            const gradient=definitions.get(id); if(!gradient)throw new Error("Missing gradient.");
            const ga=attrs(gradient),radial=Boolean(gradient.radialGradient), stops=(gradient[radial?"radialGradient":"linearGradient"] as Node[]).filter(n=>n.stop).map(attrs);
            const [minX,minY,width,height]=pathBounds(d);
            const fraction=(v:string|undefined,fallback:number)=>v===undefined?fallback:v.endsWith("%")?parseFloat(v)/100:Number(v);
            const coords=radial?[.5,.5,0,.5,.5,.5]:[fraction(ga.x1,0),fraction(ga.y1,0),fraction(ga.x2,1),fraction(ga.y2,0)];
            out.push("gsave",a["fill-rule"]==="evenodd"?"eoclip":"clip",`${minX} ${minY} translate ${width||vw} ${height||vh} scale`,`<< /ShadingType ${radial?3:2} /ColorSpace /DeviceRGB /Coords [${coords.join(" ")}] /Function << /FunctionType 2 /Domain [0 1] /C0 [${rgb(stops[0]?.["stop-color"]??"#000").join(" ")}] /C1 [${rgb(stops.at(-1)?.["stop-color"]??"#000").join(" ")}] /N 1 >> /Extend [true true] >> shfill`,"grestore");
          } else out.push(`${rgb(fill,Number(a.opacity??1)*Number(a["fill-opacity"]??1)).join(" ")} setrgbcolor`,a["fill-rule"]==="evenodd"?"eofill":"fill");
        }
        if(stroke!=="none")out.push("newpath",path,`${rgb(stroke,Number(a.opacity??1)).join(" ")} setrgbcolor`,`${num(a,"stroke-width",1)} setlinewidth`,`${a["stroke-linecap"]==="round"?1:0} setlinecap`,`${a["stroke-linejoin"]==="round"?1:0} setlinejoin`,`[${numbers(a["stroke-dasharray"]).join(" ")}] 0 setdash`,"stroke");
      }
      if(!clip)out.push("grestore");
    }
  }
  // Root viewport is already applied above.
  await draw(root.svg as Node[]); out.push("grestore","showpage","%%EOF");
  return Buffer.from(out.join("\n"));
}
