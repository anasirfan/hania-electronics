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
    <section className="border-t border-border bg-[#0B1220] py-12 sm:py-14 md:py-16">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="min-w-0 md:max-w-sm">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-2xl">
              New lights, first.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Product drops, dealer offers, and seasonal lighting edits.
            </p>
          </div>

          <form
            className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch"
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...form.register("email")}
              className="box-border h-14 w-full min-w-0 flex-1 rounded-2xl border border-white/25 bg-white px-5 text-[16px] leading-normal text-[#0B1220] placeholder:text-slate-400 outline-none focus:border-[#0B6BCB] focus:ring-2 focus:ring-[#0B6BCB]/25 sm:h-12 sm:rounded-xl sm:text-sm"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#0B6BCB] px-6 text-base font-semibold text-white transition hover:bg-[#0958a8] disabled:opacity-60 sm:h-12 sm:w-auto sm:rounded-xl sm:text-sm"
            >
              {mutation.isPending ? "Joining…" : "Subscribe"}
              {!mutation.isPending ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>
        {form.formState.errors.email ? (
          <p className="mt-2 text-xs text-rose-300 md:text-right">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
