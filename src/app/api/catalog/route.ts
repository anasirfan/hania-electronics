import {
  announcementRepository,
  bannerRepository,
  categoryRepository,
  homepageRepository,
  productRepository,
} from "@/server/repositories";
import { jsonOk } from "@/server/api/http";

export async function GET() {
  const [categories, products, banners, announcement, homepage] =
    await Promise.all([
      categoryRepository.list(false),
      productRepository.list({ publishedOnly: true }),
      bannerRepository.list(true),
      announcementRepository.get(),
      homepageRepository.get(),
    ]);

  return jsonOk({
    categories,
    products,
    banners,
    announcement,
    homepage,
  });
}
