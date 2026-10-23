import { exportFormats, exportMime, exportQr, type ExportFormat } from "@/lib/qr/exports";
import { billingCustomer, getBillingStore, sameOrigin } from "@/lib/billing/server";
import { validatedDesign, validateExportAccess, designCorrection, freeTemplateForDesign } from "@/lib/qr/access";
import { renderQrSvg, setSvgDimensions } from "@/lib/qr/render";
import { normalizeLogoDataUrl } from "@/lib/qr/logo";
import { premiumTemplate } from "@/lib/qr/premium-templates";
import { referenceImages } from "@/lib/qr/reference-images";
import { localTemplateReview } from "@/lib/qr/local-review";
import { uploadedFrameImage } from "@/lib/qr/uploaded-frame-image";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 1_100_000) return Response.json({ error: "Request too large." }, { status: 413 });
    const { payload, design: input, format, size, preview, correction = "M" } = JSON.parse(text);
    if (typeof payload !== "string" || !payload || payload.length > 8000 || ![512, 1000, 2000].includes(size) || !exportFormats.includes(format)) {
      return Response.json({ error: "Invalid export request." }, { status: 400 });
    }
    const review = localTemplateReview(request);
    const customerId = review ? "" : await billingCustomer();
    const db = review ? null : getBillingStore();
    const { pro } = db ? await db.entitlement(customerId) : { pro: false };
    const designAccess = pro || review;
    const design = validatedDesign(input);
    try { validateExportAccess(designAccess, design, preview === true ? "png" : format, preview === true ? 512 : size); }
    catch { return Response.json({ error: "Unlock Pro for this design or export.", upgrade: true }, { status: 403 }); }
    if (!["L", "M", "Q", "H"].includes(correction)) return Response.json({ error: "Invalid correction level." }, { status: 400 });
    if (!designAccess && correction !== "M" && correction !== freeTemplateForDesign(design)?.errorCorrection) return Response.json({ error: "Unlock Pro for advanced customization.", upgrade: true }, { status: 403 });
    if (design.logoDataUrl) design.logoDataUrl = await normalizeLogoDataUrl(design.logoDataUrl);
    const source = premiumTemplate(design.premiumTemplateId)?.sourceId;
    // Artistic scan cores lose essential detail at 256px. Keep a high-density
    // preview; CSS controls its displayed size without destroying source pixels.
    const artwork = source ? referenceImages[source] : design.uploadedFrameId ? uploadedFrameImage(design.uploadedFrameId) : undefined;
    const svg = setSvgDimensions(renderQrSvg(payload, designCorrection(design, correction), design, artwork), preview === true ? (source ? 1000 : 512) : size);
    const outputFormat: ExportFormat = preview === true ? "png" : format;
    const data = await exportQr(svg, outputFormat, preview === true ? (source ? 1000 : 512) : size);
    if (preview !== true && !designAccess && db && !(await db.consumeFreeDownload(customerId))) {
      return Response.json({ error: "Your 3 free downloads for today have been used. Unlock Pro for unlimited downloads.", upgrade: true }, { status: 429 });
    }
    return new Response(new Uint8Array(data), { headers: { "Content-Type": exportMime[outputFormat], "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return Response.json({ error: "Could not render this QR code. Check your design or retry." }, { status: 400 });
  }
}
