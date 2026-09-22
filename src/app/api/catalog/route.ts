import {
  announcementRepository,
  bannerRepository,
  categoryRepository,
  homepageRepository,
  productRepository,
  siteSettingsRepository,
} from "@/server/repositories";
import { jsonOk } from "@/server/api/http";

export async function GET() {
  const [categories, products, banners, announcement, homepage, settings] =
    await Promise.all([
      categoryRepository.list(false),
      productRepository.list({ publishedOnly: true }),
      bannerRepository.list(true),
      announcementRepository.get(),
      homepageRepository.get(),
      siteSettingsRepository.get(),
    ]);

  return jsonOk({
    categories,
    products,
    banners,
    announcement,
    homepage,
    settings,
  });
}
