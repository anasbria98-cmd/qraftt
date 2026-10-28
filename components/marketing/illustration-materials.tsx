import type { CSSProperties } from "react";

/** Local SVG paint servers: no runtime animation, raster assets or template changes. */
export function illustrationMaterialStyle(id: string): CSSProperties {
  return {
    "--object-porcelain": `url(#${id}-porcelain)`,
    "--object-enamel": `url(#${id}-enamel)`,
    "--object-mint": `url(#${id}-mint)`,
  } as CSSProperties;
}

export function IllustrationMaterials({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-porcelain`} x1="0" x2=".85" y1="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".08" stopColor="#ffffff" />
        <stop offset=".15" stopColor="#f6fcf3" />
        <stop offset=".72" stopColor="#e1eedf" />
        <stop offset=".94" stopColor="#c4d8c8" />
        <stop offset="1" stopColor="#9cbaa7" />
      </linearGradient>
      <linearGradient id={`${id}-enamel`} x1="0" x2=".9" y1="0" y2="1">
        <stop offset="0" stopColor="#629b7a" />
        <stop offset=".12" stopColor="#3f7b59" />
        <stop offset=".46" stopColor="#235b40" />
        <stop offset=".88" stopColor="#123e2e" />
        <stop offset="1" stopColor="#0d3025" />
      </linearGradient>
      <radialGradient id={`${id}-mint`} cx=".28" cy=".16" r=".95">
        <stop offset="0" stopColor="#f2ffed" />
        <stop offset=".35" stopColor="#b8e2c3" />
        <stop offset=".8" stopColor="#7cb58e" />
        <stop offset="1" stopColor="#4f8e69" />
      </radialGradient>
    </defs>
  );
}
