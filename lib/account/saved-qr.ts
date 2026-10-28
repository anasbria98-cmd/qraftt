import "server-only";
import { adminClient, currentUser } from "@/lib/supabase/server";
import { validatedDesign } from "@/lib/qr/access";
import { buildQrPayload } from "@/lib/qr/payloads";
import { qrTypeOptions } from "@/lib/qr/config";
import { qrContentValues } from "@/lib/qr/content-values";
import { normalizeLogoDataUrl } from "@/lib/qr/logo";
import type { ErrorCorrectionLevel, QrFormValues, QrType } from "@/lib/qr/types";
export interface SavedDocument {
  version: 1; type: QrType; values: Partial<QrFormValues>;
  design: ReturnType<typeof validatedDesign>; correction: ErrorCorrectionLevel;
  format: "png"|"jpg"|"svg"|"pdf"|"eps"; size: 512|1000|2000;
}
export interface SavedUsage { count: number; bytes: number; savedLimit: number; storageLimit: number; interval: string|null }
export interface SavedSummary { id: string; title: string; storage_bytes: number; updated_at: string }
export function validateSavedDocument(input: unknown): SavedDocument {
  if(!input||typeof input!=="object")throw new Error("Invalid saved QR.");
  const d=input as SavedDocument;
  if(d.version!==1 || !qrTypeOptions.some(t=>t.value===d.type) || !d.values || typeof d.values!=="object" || Array.isArray(d.values)
    || !["L","M","Q","H"].includes(d.correction) || !["png","jpg","svg","pdf","eps"].includes(d.format) || ![512,1000,2000].includes(d.size)) throw new Error("Invalid saved QR.");
  if(Object.values(d.values).some(v=>typeof v!=="string"&&typeof v!=="boolean"))throw new Error("Invalid QR content.");
  const result={version:1 as const,type:d.type,values:qrContentValues(d.type,d.values),design:validatedDesign(d.design),correction:d.correction,format:d.format,size:d.size};
  if(!buildQrPayload(result.type,result.values as QrFormValues).payload)throw new Error("Complete the QR content before saving.");
  if(Buffer.byteLength(JSON.stringify(result))>1_050_000)throw new Error("Saved QR is too large.");
  return result;
}
export async function savedQr(action: string, input: { id?: string; title?: string; document?: SavedDocument } = {}) {
  const user=await currentUser(); if(!user)throw new Error("LOGIN_REQUIRED");
  if(action==="save" && input.document?.design.logoDataUrl) input.document.design.logoDataUrl=await normalizeLogoDataUrl(input.document.design.logoDataUrl);
  const {data,error}=await adminClient().rpc("qraftt_saved_qr",{p_user:user.id,p_plans:[],p_action:action,p_id:input.id??null,p_title:input.title??null,p_document:input.document??null});
  if(error) {
    const code=["NOT_FOUND","SAVED_QR_LIMIT","STORAGE_LIMIT","DOCUMENT_TOO_LARGE","INVALID_DOCUMENT"].find(c=>error.message.includes(c));
    throw new Error(code??"Saved QR storage is temporarily unavailable. Please try again later.");
  }
  return data;
}
