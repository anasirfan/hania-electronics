import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/features/products/product-card";
import { productRepository } from "@/features/products/repository";

export async function BestSellersSection() {
  const products = await productRepository.getBestsellers();
  const [hero, ...rest] = products.slice(0, 4);

  return (
    <section id="bestsellers" className="relative py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Best Sellers
              </p>
            </Reveal>
            <Reveal variant="mask">
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Most ordered lights
              </h2>
            </Reveal>
          </div>
        </div>

        {hero ? (
          <div className="grid gap-6 lg:grid-cols-5">
            <Reveal variant="clip" className="lg:col-span-3">
              <ProductCard product={hero} large className="h-full" />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
              {rest.map((product, i) => (
                <Reveal key={product.id} variant="slide" delay={0.08 + i * 0.06}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
