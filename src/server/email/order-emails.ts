import { Resend } from "resend";
import type { Order } from "@/domain/types";
import { formatPKR } from "@/lib/money";
import { siteSettingsRepository } from "@/server/repositories";

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(storeName: string) {
  const from =
    process.env.EMAIL_FROM ??
    `${storeName} <orders@haniaelectronics.pk>`;
  return from;
}

function storeNotifyEmail(fallback: string) {
  return (
    process.env.ORDER_NOTIFY_EMAIL ??
    process.env.ADMIN_EMAIL ??
    fallback
  );
}

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "https://haniaelectronics.pk").replace(
    /\/$/,
    "",
  );
}

function itemsHtml(order: Order) {
  return order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(i.name)} × ${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPKR(i.lineTotal)}</td>
      </tr>`,
    )
    .join("");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function customerEmailHtml(order: Order, storeName: string) {
  const track = `${appUrl()}/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.customer.phone)}`;
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0B1220;">
    <h1 style="font-size:20px;margin:0 0 8px;">Order confirmed</h1>
    <p style="color:#556;margin:0 0 20px;">Thanks ${escapeHtml(order.customer.fullName)} — we received your COD order.</p>
    <p style="margin:0 0 4px;"><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
    <p style="margin:0 0 16px;"><strong>Total:</strong> ${formatPKR(order.total)} · Cash on Delivery</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${itemsHtml(order)}</table>
    <p style="margin:16px 0 4px;"><strong>Ship to</strong></p>
    <p style="margin:0;color:#445;font-size:14px;">
      ${escapeHtml(order.customer.address)}<br/>
      ${escapeHtml(order.customer.city)}, ${escapeHtml(order.customer.province)}
      ${order.customer.postalCode ? `<br/>${escapeHtml(order.customer.postalCode)}` : ""}
    </p>
    <p style="margin:24px 0 0;">
      <a href="${track}" style="display:inline-block;background:#0B6BCB;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">Track your order</a>
    </p>
    <p style="margin:24px 0 0;font-size:12px;color:#888;">— ${escapeHtml(storeName)}</p>
  </div>`;
}

function storeEmailHtml(order: Order) {
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0B1220;">
    <h1 style="font-size:20px;margin:0 0 8px;">New COD order</h1>
    <p style="margin:0 0 16px;"><strong>${escapeHtml(order.orderNumber)}</strong> · ${formatPKR(order.total)}</p>
    <p style="margin:0 0 4px;"><strong>Customer:</strong> ${escapeHtml(order.customer.fullName)}</p>
    <p style="margin:0 0 4px;"><strong>Phone:</strong> ${escapeHtml(order.customer.phone)}</p>
    ${order.customer.email ? `<p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(order.customer.email)}</p>` : ""}
    <p style="margin:0 0 16px;"><strong>Address:</strong> ${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)}, ${escapeHtml(order.customer.province)}</p>
    ${order.customer.notes ? `<p style="margin:0 0 16px;"><strong>Notes:</strong> ${escapeHtml(order.customer.notes)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${itemsHtml(order)}</table>
    <p style="margin:20px 0 0;font-size:13px;">
      <a href="${appUrl()}/admin/orders">Open admin orders</a>
    </p>
  </div>`;
}

/** Fire-and-forget safe: never throws to the order API. */
export async function sendOrderEmails(order: Order): Promise<void> {
  const resend = resendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping order emails");
    return;
  }

  try {
    const settings = await siteSettingsRepository.get();
    const from = fromAddress(settings.storeName);
    const notifyTo = storeNotifyEmail(settings.email);
    const replyTo = settings.email || undefined;

    const jobs: Promise<unknown>[] = [];

    if (notifyTo) {
      jobs.push(
        resend.emails
          .send({
            from,
            to: notifyTo,
            replyTo: order.customer.email || replyTo,
            subject: `New order ${order.orderNumber} · ${formatPKR(order.total)}`,
            html: storeEmailHtml(order),
          })
          .then(({ error }) => {
            if (error) console.error("[email] store notify failed", error);
          }),
      );
    }

    if (order.customer.email?.trim()) {
      jobs.push(
        resend.emails
          .send({
            from,
            to: order.customer.email.trim(),
            replyTo,
            subject: `Order ${order.orderNumber} confirmed — ${settings.storeName}`,
            html: customerEmailHtml(order, settings.storeName),
          })
          .then(({ error }) => {
            if (error) console.error("[email] customer confirm failed", error);
          }),
      );
    }

    await Promise.all(jobs);
  } catch (err) {
    console.error("[email] sendOrderEmails error", err);
  }
}
