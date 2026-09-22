import { isSupabaseConfigured } from "@/server/supabase/client";
import {
  mockAnnouncementRepository,
  mockBannerRepository,
  mockCategoryRepository,
  mockHomepageRepository,
  mockOrderRepository,
  mockProductRepository,
} from "@/server/repositories/mock";
import {
  supabaseAnnouncementRepository,
  supabaseBannerRepository,
  supabaseCategoryRepository,
  supabaseHomepageRepository,
  supabaseOrderRepository,
  supabaseProductRepository,
} from "@/server/repositories/supabase";

function isMissingTableError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /PGRST205|schema cache|Could not find the table|relation .* does not exist/i.test(
    msg,
  );
}

/**
 * Prefer Supabase when configured; automatically fall back to the file DB
 * until schema.sql has been applied on the empty project.
 */
function dual<T extends object>(mockRepo: T, sbRepo: T): T {
  if (!isSupabaseConfigured()) return mockRepo;

  return new Proxy(mockRepo, {
    get(_target, prop, receiver) {
      const sbVal = Reflect.get(sbRepo, prop, sbRepo);
      const mockVal = Reflect.get(mockRepo, prop, mockRepo);
      if (typeof sbVal !== "function") {
        return sbVal ?? Reflect.get(mockRepo, prop, receiver);
      }
      return async (...args: unknown[]) => {
        try {
          return await (sbVal as (...a: unknown[]) => unknown).apply(
            sbRepo,
            args,
          );
        } catch (error) {
          if (isMissingTableError(error)) {
            console.warn(
              `[data] Supabase schema not ready — using mock for ${String(prop)}`,
            );
            return await (mockVal as (...a: unknown[]) => unknown).apply(
              mockRepo,
              args,
            );
          }
          throw error;
        }
      };
    },
  });
}

export const categoryRepository = dual(
  mockCategoryRepository,
  supabaseCategoryRepository,
);
export const productRepository = dual(
  mockProductRepository,
  supabaseProductRepository,
);
export const bannerRepository = dual(
  mockBannerRepository,
  supabaseBannerRepository,
);
export const announcementRepository = dual(
  mockAnnouncementRepository,
  supabaseAnnouncementRepository,
);
export const homepageRepository = dual(
  mockHomepageRepository,
  supabaseHomepageRepository,
);
export const orderRepository = dual(
  mockOrderRepository,
  supabaseOrderRepository,
);

export function getDataBackend(): "supabase" | "mock" {
  return isSupabaseConfigured() ? "supabase" : "mock";
}

export { siteSettingsRepository } from "@/server/repositories/site-settings";
