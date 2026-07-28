"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  city: z.string().min(2, "Enter your city"),
  businessType: z.string().min(2, "Enter your business type"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

async function submitApplication(data: FormValues) {
  await new Promise((r) => setTimeout(r, 700));
  return data;
}

export function DealerApplicationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", city: "", businessType: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      toast.success("Application received — we'll reach out on WhatsApp within 24 hours.");
      form.reset();
    },
    onError: () => toast.error("Something went wrong. Try WhatsApp instead."),
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div className="grid gap-2">
        <Label htmlFor="da-name" className="text-sm font-medium">
          Full name
        </Label>
        <Input
          id="da-name"
          placeholder="Muhammad Ali"
          {...form.register("name")}
          className="h-12 rounded-xl"
        />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="da-phone" className="text-sm font-medium">
            Phone / WhatsApp
          </Label>
          <Input
            id="da-phone"
            placeholder="0300-0000000"
            {...form.register("phone")}
            className="h-12 rounded-xl"
          />
          {form.formState.errors.phone ? (
            <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="da-city" className="text-sm font-medium">
            City
          </Label>
          <Input
            id="da-city"
            placeholder="Lahore"
            {...form.register("city")}
            className="h-12 rounded-xl"
          />
          {form.formState.errors.city ? (
            <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="da-type" className="text-sm font-medium">
          Business type
        </Label>
        <Input
          id="da-type"
          placeholder="Retail shop / Wholesale / Online store / Distributor"
          {...form.register("businessType")}
          className="h-12 rounded-xl"
        />
        {form.formState.errors.businessType ? (
          <p className="text-xs text-destructive">{form.formState.errors.businessType.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="da-message" className="text-sm font-medium">
          Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="da-message"
          placeholder="Monthly volume, products you're most interested in, cities you serve..."
          rows={4}
          {...form.register("message")}
          className="rounded-xl resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-foreground px-8 text-[15px] font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
        style={{ height: "52px" }}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Submit application
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
