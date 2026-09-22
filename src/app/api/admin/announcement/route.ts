import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk, parseJson } from "@/server/api/http";
import { announcementRepository } from "@/server/repositories";
import type { AnnouncementBar } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const announcement = await announcementRepository.get();
  return jsonOk({ announcement });
}

export async function PATCH(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const patch = await parseJson<Partial<AnnouncementBar>>(req);
  const announcement = await announcementRepository.update(patch);
  return jsonOk({ announcement });
}
