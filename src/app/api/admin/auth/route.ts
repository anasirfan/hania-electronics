import {
  createAdminSession,
  destroyAdminSession,
  getAdminCredentials,
  getAdminSession,
} from "@/server/auth/session";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";

export async function POST(req: Request) {
  const body = await parseJson<{ email?: string; password?: string }>(req);
  const creds = getAdminCredentials();
  if (
    body.email?.trim().toLowerCase() !== creds.email.toLowerCase() ||
    body.password !== creds.password
  ) {
    return jsonError("Invalid email or password", 401);
  }
  await createAdminSession(creds.email);
  return jsonOk({ ok: true, email: creds.email });
}

export async function DELETE() {
  await destroyAdminSession();
  return jsonOk({ ok: true });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  return jsonOk(session);
}
