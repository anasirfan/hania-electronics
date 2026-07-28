"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { whatsappUrl } from "@/lib/brand";

const schema = z.object({
  orderId: z.string().min(3, "Enter your order ID"),
});

type FormValues = z.infer<typeof schema>;

export function TrackOrderDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { orderId: "" },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track Order</DialogTitle>
          <DialogDescription>
            Enter your order ID — we&apos;ll confirm status via WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            toast.message("Connecting you to WhatsApp…");
            window.open(
              whatsappUrl(
                `Assalam o Alaikum! Please share status for order ID: ${values.orderId}`,
              ),
              "_blank",
              "noopener,noreferrer",
            );
            setOpen(false);
            form.reset();
          })}
        >
          <div className="grid gap-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              placeholder="e.g. HE-1024"
              {...form.register("orderId")}
            />
            {form.formState.errors.orderId ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.orderId.message}
              </p>
            ) : null}
          </div>
          <Button type="submit">Track via WhatsApp</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
