import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk, parseJson } from "@/server/api/http";
import { aboutContentRepository } from "@/server/repositories";
import type { AboutContent } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const about = await aboutContentRepository.get();
  return jsonOk({ about });
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await parseJson<Partial<AboutContent>>(req);
  const about = await aboutContentRepository.update(body);
  return jsonOk({ about });
}
