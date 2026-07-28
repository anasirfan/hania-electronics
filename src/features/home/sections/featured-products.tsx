import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/features/products/product-card";
import { productRepository } from "@/features/products/repository";

export async function FeaturedProductsSection() {
  const featured = await productRepository.getFeatured();

  return (
    <section id="featured" className="relative py-20 md:py-28">
      <Container>
        <div className="mb-12 max-w-xl">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Featured
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Selected for the room
            </h2>
          </Reveal>
          <Reveal variant="blur" delay={0.08}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A quieter edit — lights that look as good as they perform.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((product, i) => (
            <Reveal key={product.id} variant="scale" delay={i * 0.045}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
