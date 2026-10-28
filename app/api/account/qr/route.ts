import { sameOrigin } from "@/lib/billing/server";
import { savedQr, validateSavedDocument } from "@/lib/account/saved-qr";
function failure(error: unknown) {
  const message=error instanceof Error?error.message:"Saved QR storage is unavailable.";
  const status=message==="LOGIN_REQUIRED"?401:message==="NOT_FOUND"?404:message.endsWith("_LIMIT")?409:message.includes("unavailable")?503:400;
  const friendly: Record<string,string> = {
    LOGIN_REQUIRED: "Log in to access your saved QR codes.",
    NOT_FOUND: "This saved QR code was not found.", SAVED_QR_LIMIT: "Your account has reached its limit of 100 saved QR codes. Delete old saved QR codes to free space before saving another.",
    STORAGE_LIMIT: "Your account has reached its 250 MB storage limit. Delete old saved QR codes or files to free space before saving or uploading more.",
    DOCUMENT_TOO_LARGE: "This QR design is too large to save. Try a smaller logo.", INVALID_DOCUMENT: "This QR design could not be saved. Check your content and try again.",
  };
  return Response.json({error:friendly[message]??message},{status,headers:{"Cache-Control":"private, no-store"}});
}
export async function GET(request: Request) {
  const url=new URL(request.url); const id=url.searchParams.get("id");
  if(id&&!/^[a-f\d-]{36}$/i.test(id))return Response.json({error:"Invalid QR ID."},{status:400});
  try {return Response.json(await savedQr(id?"get":url.searchParams.has("usage")?"usage":"list",{id:id??undefined}),{headers:{"Cache-Control":"private, no-store"}});}catch(e){return failure(e);}
}
export async function POST(request: Request) {
  if(!sameOrigin(request))return Response.json({error:"Invalid origin."},{status:403});
  try {
    const body=await request.text();if(body.length>1_100_000)return Response.json({error:"Saved QR is too large."},{status:413});
    const input=JSON.parse(body);
    if(input.id&&!/^[a-f\d-]{36}$/i.test(input.id))throw new Error("Invalid QR ID.");
    if(input.action==="delete")return Response.json(await savedQr("delete",{id:input.id}),{headers:{"Cache-Control":"private, no-store"}});
    const title=String(input.title??"").trim();if(!title||title.length>100)throw new Error("Use a name between 1 and 100 characters.");
    const document = validateSavedDocument(input.document);
    return Response.json(await savedQr("save",{id:input.id,title,document}),{headers:{"Cache-Control":"private, no-store"}});
  }catch(e){return failure(e);}
}
