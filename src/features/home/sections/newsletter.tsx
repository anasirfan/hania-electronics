"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

async function subscribe(data: FormValues) {
  await new Promise((r) => setTimeout(r, 500));
  return data;
}

export function NewsletterSection() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      toast.success("You're on the list — welcome to Hania.");
      form.reset();
    },
  });

  return (
    <section className="relative overflow-hidden bg-[#0d1526] py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_10%,rgba(245,197,122,0.14),transparent_55%),radial-gradient(ellipse_60%_60%_at_85%_90%,rgba(34,211,238,0.16),transparent_55%)]"
      />
      <Container className="relative max-w-xl text-center">
        <Reveal variant="fade">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30">
            Newsletter
          </p>
        </Reveal>
        <Reveal variant="mask">
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            New lights, first.
          </h2>
        </Reveal>
        <Reveal variant="fade" delay={0.08}>
          <p className="mt-3 text-white/50">
            Product drops, dealer offers, and seasonal lighting edits.
          </p>
        </Reveal>

        <Reveal variant="fade" delay={0.14}>
          <form
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          >
            <input
              type="email"
              placeholder="you@email.com"
              aria-label="Email"
              {...form.register("email")}
              className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/35"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-dark transition hover:bg-white/90 disabled:opacity-60"
            >
              {mutation.isPending ? "Joining…" : "Subscribe"}
              {!mutation.isPending ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
          {form.formState.errors.email ? (
            <p className="mt-2 text-xs text-rose-300">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
