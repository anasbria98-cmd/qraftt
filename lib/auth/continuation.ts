import "server-only";
import { safeReturnPath } from "./redirect";
export async function authReturnPath(value: unknown) { return safeReturnPath(value); }
