"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

async function subscribe(data: FormValues) {
  await new Promise((r) => setTimeout(r, 400));
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
    <section className="border-t border-border bg-[#0B1220] py-14 md:py-16">
      <Container className="flex max-w-4xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
            New lights, first.
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Product drops, dealer offers, and seasonal lighting edits.
          </p>
        </div>
        <form
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          <input
            type="email"
            placeholder="you@email.com"
            aria-label="Email"
            {...form.register("email")}
            className="h-11 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/35"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B6BCB] px-5 text-sm font-semibold text-white transition hover:bg-[#0958a8] disabled:opacity-60"
          >
            {mutation.isPending ? "Joining…" : "Subscribe"}
            {!mutation.isPending ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
      </Container>
    </section>
  );
}
