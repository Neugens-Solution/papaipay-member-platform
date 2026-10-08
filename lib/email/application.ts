import "server-only";

type Kind = "received" | "correction" | "approved";

type ApplicationEmail = {
  kind: Kind;
  to: string;
  name: string;
  eventId: string;
  reason?: string;
  note?: string;
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char] || char);

export async function sendApplicationEmail(input: ApplicationEmail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.APP_URL;
  if (!key || !from || !appUrl || !/^https:\/\/[^/]+$/.test(appUrl)) {
    console.error("Application email unavailable: server email configuration is incomplete", { kind: input.kind });
    return false;
  }

  const info = {
    received: {
      subject: "Application Received – K Asset Ventures",
      heading: "Application received",
      message: "Thank you for submitting your membership application. It is now under review. We will notify you when the review is complete.",
      button: "View application status",
      path: "/application",
    },
    correction: {
      subject: "Action Required – K Asset Ventures Membership Application",
      heading: "Action required",
      message: "We need additional information before we can complete your application review. Please review the guidance below and resubmit your application.",
      button: "Review and update application",
      path: "/application",
    },
    approved: {
      subject: "Your K Asset Ventures Membership Application Has Been Approved",
      heading: "Membership application approved",
      message: "Your membership application has been approved. You can now access the Member Portal.",
      button: "Access Member Portal",
      path: "/member/login",
    },
  }[input.kind];

  const link = `${appUrl}${info.path}`;
  const guidance = input.kind === "correction" && input.reason
    ? `<p style="font-weight:600">${escapeHtml(input.reason)}</p>${input.note ? `<p>${escapeHtml(input.note)}</p>` : ""}`
    : "";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(info.subject)}</title></head>
  <body style="margin:0;background:#f5f7f5;color:#17251f;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7f5"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #e3e9e5;border-radius:12px">
  <tr><td style="padding:28px 28px 16px"><img src="${appUrl}/kav-favicon.png" alt="K Asset Ventures logo" width="56" height="56" style="display:block;border:0;width:56px;height:56px"><strong style="display:block;margin-top:12px;font-size:18px">K Asset Ventures</strong></td></tr>
  <tr><td style="padding:0 28px 28px"><h1 style="font-size:24px;line-height:1.3;margin:12px 0">${escapeHtml(info.heading)}</h1><p>Dear ${escapeHtml(input.name)},</p><p style="line-height:1.6">${escapeHtml(info.message)}</p>${guidance}
  <p style="margin:28px 0"><a href="${link}" style="display:inline-block;background:#145a3c;color:#fff;text-decoration:none;padding:14px 20px;border-radius:8px;font-weight:bold">${escapeHtml(info.button)}</a></p>
  <p style="font-size:13px;line-height:1.5">If the button does not work, visit <a href="${link}">${link}</a>.</p></td></tr>
  <tr><td style="padding:18px 28px;border-top:1px solid #e3e9e5;color:#59665e;font-size:12px;line-height:1.5">K Asset Ventures · Automated application notification. Do not share your login credentials.</td></tr></table></td></tr></table></body></html>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `membership-${input.kind}-${input.eventId}` },
      body: JSON.stringify({ from, to: [input.to], subject: info.subject, html }),
    });
    if (!response.ok) {
      console.error("Application email rejected by provider", { kind: input.kind, status: response.status });
      return false;
    }
    return true;
  } catch {
    console.error("Application email delivery request failed", { kind: input.kind });
    return false;
  }
}
