import { getAdminSession } from "@/server/auth/session";
import { jsonError } from "@/server/api/http";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return { session: null, error: jsonError("Unauthorized", 401) };
  }
  return { session, error: null };
}
