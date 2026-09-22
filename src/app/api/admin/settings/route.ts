import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { siteSettingsRepository } from "@/server/repositories";
import type { SiteSettings } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const settings = await siteSettingsRepository.get();
  return jsonOk({ settings });
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await parseJson<Partial<SiteSettings>>(req);
  const settings = await siteSettingsRepository.update(body);
  return jsonOk({ settings });
}
