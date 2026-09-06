import nodemailer from "nodemailer";
import { formatNaira, formatDate } from "./utils";
import type { Order, Product } from "./types";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function invoiceHtml(order: Order, product: Product | null) {
  const price = product ? formatNaira(product.price) : "To be confirmed";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const logoUrl = `${siteUrl}/images/logo.jpg`;
  const productRow = product
    ? `<tr>
         <td style="padding:12px 0;border-bottom:1px solid #23324a;color:#e2e8f0;">${product.title}</td>
         <td style="padding:12px 0;border-bottom:1px solid #23324a;color:#e2e8f0;text-align:right;">${price}</td>
       </tr>`
    : `<tr><td colspan="2" style="padding:12px 0;color:#e2e8f0;">General consultation request</td></tr>`;

  return `
  <div style="background:#0F172A;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#111d34;border-radius:12px;overflow:hidden;border:1px solid #23324a;">
      <tr>
        <td style="background:#8FD11F;padding:20px 28px;">
          <table role="presentation" width="100%">
            <tr>
              <td width="48" style="vertical-align:middle;">
                <table role="presentation" width="40" height="40" style="background:#ffffff;border-radius:9999px;">
                  <tr><td align="center" valign="middle">
                    <img src="${logoUrl}" width="30" height="30" alt="Vozaro" style="display:block;border-radius:9999px;object-fit:contain;" />
                  </td></tr>
                </table>
              </td>
              <td style="vertical-align:middle;padding-left:10px;">
                <p style="margin:0;color:#0F172A;font-weight:800;font-size:18px;letter-spacing:0.3px;">VOZARO GLOBAL RESOURCE LTD.</p>
                <p style="margin:2px 0 0;color:#0F172A;font-size:12px;font-weight:600;">Light wey no dey fail</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order Confirmation</p>
          <p style="margin:0 0 20px;color:#ffffff;font-size:20px;font-weight:700;">${order.order_number}</p>

          <table role="presentation" width="100%" style="margin-bottom:20px;">
            <tr><td style="color:#94a3b8;font-size:13px;padding:4px 0;">Name</td><td style="color:#ffffff;font-size:13px;text-align:right;">${order.customer_name}</td></tr>
            <tr><td style="color:#94a3b8;font-size:13px;padding:4px 0;">Phone</td><td style="color:#ffffff;font-size:13px;text-align:right;">${order.customer_phone}</td></tr>
            <tr><td style="color:#94a3b8;font-size:13px;padding:4px 0;">Date</td><td style="color:#ffffff;font-size:13px;text-align:right;">${formatDate(order.created_at)}</td></tr>
            ${order.delivery_address ? `<tr><td style="color:#94a3b8;font-size:13px;padding:4px 0;">Delivery Address</td><td style="color:#ffffff;font-size:13px;text-align:right;">${order.delivery_address}</td></tr>` : ""}
          </table>

          <table role="presentation" width="100%" style="border-top:1px solid #23324a;padding-top:8px;">
            ${productRow}
          </table>

          ${order.additional_notes ? `<p style="margin:20px 0 0;color:#94a3b8;font-size:13px;">Notes: ${order.additional_notes}</p>` : ""}

          <p style="margin:28px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
            Our team will reach out shortly to confirm details and next steps.
            For urgent enquiries, WhatsApp us at ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#0c1526;">
          <p style="margin:0;color:#475569;font-size:11px;">Shop 10, Edjemuonyavwe Community, Oghara, Delta State, Nigeria</p>
        </td>
      </tr>
    </table>
  </div>`;
}

export async function sendOrderInvoiceEmails(order: Order, product: Product | null) {
  const t = getTransporter();
  const html = invoiceHtml(order, product);
  const fromName = process.env.SMTP_FROM_NAME ?? "Vozaro Global Resource Ltd";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER;
  const ownerEmail = process.env.BUSINESS_OWNER_EMAIL ?? process.env.SMTP_USER;

  const results = await Promise.allSettled([
    t.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: order.customer_email,
      subject: `Your Vozaro order ${order.order_number} has been received`,
      html,
    }),
    t.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: ownerEmail,
      subject: `New order ${order.order_number} — ${order.customer_name}`,
      html,
    }),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error("sendOrderInvoiceEmails: one or more emails failed", failed);
  }

  return { success: failed.length < results.length };
}
