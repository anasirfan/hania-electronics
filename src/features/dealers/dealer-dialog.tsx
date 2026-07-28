"use client";

import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(10, "Enter a valid phone"),
  city: z.string().min(2, "Enter your city"),
  businessType: z.string().min(2, "Enter business type"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

async function submitDealer(data: FormValues) {
  await new Promise((r) => setTimeout(r, 600));
  return data;
}

export function DealerDialog({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      businessType: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitDealer,
    onSuccess: () => {
      toast.success("Application received — we'll contact you shortly.");
      form.reset();
      onOpenChange?.(false);
    },
    onError: () => toast.error("Something went wrong. Try WhatsApp instead."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Become a Dealer</DialogTitle>
          <DialogDescription>
            Partner with HANIA ELECTRONICS for wholesale pricing across Pakistan.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...form.register("city")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessType">Business type</Label>
            <Input
              id="businessType"
              placeholder="Retail / Wholesale / Distributor"
              {...form.register("businessType")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" {...form.register("message")} />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
