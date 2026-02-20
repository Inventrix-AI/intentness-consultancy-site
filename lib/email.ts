import nodemailer from "nodemailer";
import type { Lead, InvoiceRequestPayload } from "@/lib/types";

/* ── SMTP transporter (Hostinger) ── */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true, // SSL on port 465
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? ""
  }
});

const COMPANY = "Intentness Consultancy";

/* ── Alias "From" addresses ── */

const FROM_CONTACT = `${COMPANY} <contact@intentsupportservices.com>`;
const FROM_HELLO = `${COMPANY} <hello@intentsupportservices.com>`;
const FROM_BILLING = `${COMPANY} <billing@intentsupportservices.com>`;

/* ── Shared HTML wrapper ── */

function wrapHtml(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:32px;">
      ${body}
    </div>
    <p style="margin-top:24px;text-align:center;font-size:12px;color:#94a3b8;">
      &copy; ${new Date().getFullYear()} Intentness Consultancy Private Limited
    </p>
  </div>
</body>
</html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 12px 6px 0;font-size:13px;color:#64748b;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:13px;color:#0f172a;">${value}</td>
  </tr>`;
}

/* ── 1. Internal notification: new contact/lead ── */

export async function sendLeadNotification(lead: Lead) {
  const to = process.env.LEAD_EMAIL_TO ?? "contact@intentsupportservices.com";
  await transporter.sendMail({
    from: FROM_CONTACT,
    to,
    subject: `New inquiry from ${lead.name} — ${lead.serviceInterest}`,
    html: wrapHtml(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#0f172a;">New Contact Inquiry</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", lead.name)}
        ${row("Email", `<a href="mailto:${lead.workEmail}" style="color:#0284c7;">${lead.workEmail}</a>`)}
        ${row("Company", lead.company)}
        ${row("Country", lead.country)}
        ${row("Service Interest", lead.serviceInterest)}
        ${row("Lead ID", lead.id)}
        ${row("Submitted", lead.createdAt)}
      </table>
      <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
        <p style="margin:0;font-size:13px;color:#0f172a;line-height:1.6;">${lead.message.replace(/\n/g, "<br />")}</p>
      </div>
    `)
  });
}

/* ── 2. Confirmation email to the person who submitted the contact form ── */

export async function sendLeadConfirmation(lead: Lead) {
  await transporter.sendMail({
    from: FROM_HELLO,
    to: lead.workEmail,
    subject: `We've received your inquiry — ${COMPANY}`,
    html: wrapHtml(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Thank you, ${lead.name}!</h2>
      <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
        We've received your inquiry about <strong>${lead.serviceInterest}</strong> and will get back to you within 24 hours.
      </p>
      <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Here's a summary of what you submitted:</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Company", lead.company)}
        ${row("Country", lead.country)}
        ${row("Service Interest", lead.serviceInterest)}
        ${row("Reference", lead.id)}
      </table>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />
      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
        If you have any urgent questions, feel free to reply to this email or reach us at
        <a href="tel:+919739968800" style="color:#0284c7;">+91 9739968800</a>.
      </p>
    `)
  });
}

/* ── 3. Internal notification: new invoice request ── */

export async function sendInvoiceRequestNotification(req: InvoiceRequestPayload) {
  const to = process.env.INVOICE_REQUEST_EMAIL ?? "billing@intentsupportservices.com";
  await transporter.sendMail({
    from: FROM_BILLING,
    to,
    subject: `New invoice request from ${req.name} — ${req.preferredCurrency} ${req.amountTarget}`,
    html: wrapHtml(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#0f172a;">New Invoice Request</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", req.name)}
        ${row("Email", `<a href="mailto:${req.email}" style="color:#0284c7;">${req.email}</a>`)}
        ${row("Company", req.company)}
        ${row("Amount", `${req.preferredCurrency} ${req.amountTarget}`)}
        ${row("Timeline", req.timeline ?? "Not specified")}
        ${row("Request ID", req.id)}
        ${row("Submitted", req.createdAt)}
      </table>
      <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Project Scope</p>
        <p style="margin:0;font-size:13px;color:#0f172a;line-height:1.6;">${req.projectScope.replace(/\n/g, "<br />")}</p>
      </div>
    `)
  });
}

/* ── 4. Confirmation email to the person who requested an invoice ── */

export async function sendInvoiceRequestConfirmation(req: InvoiceRequestPayload) {
  await transporter.sendMail({
    from: FROM_BILLING,
    to: req.email,
    subject: `Invoice request received — ${COMPANY}`,
    html: wrapHtml(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Thank you, ${req.name}!</h2>
      <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
        We've received your invoice request and our billing team will prepare it shortly.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Company", req.company)}
        ${row("Amount", `${req.preferredCurrency} ${req.amountTarget}`)}
        ${row("Timeline", req.timeline ?? "Not specified")}
        ${row("Reference", req.id)}
      </table>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />
      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
        If you need to follow up, reply to this email or reach our billing team at
        <a href="mailto:billing@intentsupportservices.com" style="color:#0284c7;">billing@intentsupportservices.com</a>.
      </p>
    `)
  });
}
