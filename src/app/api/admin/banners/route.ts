import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { bannerRepository } from "@/server/repositories";
import type { Banner } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const banners = await bannerRepository.list(false);
  return jsonOk({ banners });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await parseJson<Omit<Banner, "id" | "createdAt" | "updatedAt">>(
    req,
  );
  if (!body.title || !body.desktopImage) {
    return jsonError("Title and desktop image required");
  }
  const banner = await bannerRepository.create({
    title: body.title,
    subtitle: body.subtitle ?? "",
    ctaText: body.ctaText ?? "Shop Now",
    ctaLink: body.ctaLink ?? "/shop",
    desktopImage: body.desktopImage,
    mobileImage: body.mobileImage || body.desktopImage,
    active: body.active ?? true,
    sortOrder: body.sortOrder ?? 99,
    startDate: body.startDate ?? null,
    endDate: body.endDate ?? null,
  });
  return jsonOk({ banner }, { status: 201 });
}
