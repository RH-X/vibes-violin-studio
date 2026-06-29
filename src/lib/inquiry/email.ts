import { Resend } from 'resend';
import type { InquiryConfig } from './types';
import type { FieldValues } from './validate';

export const resend = new Resend(import.meta.env.RESEND_API_KEY);

export function buildVerificationEmail(
  config: InquiryConfig,
  opts: { name: string | null; verifyUrl: string }
): { subject: string; html: string; text: string } {
  const greeting = opts.name ? `Hi ${opts.name},` : 'Hi there,';
  const subject = config.emailTemplate.verificationSubject;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e9d5ff;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6ee7b7 0%,#c4b5fd 100%);padding:32px 40px;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#6d3fc1;">Vibrations Violin Studio</p>
              <h1 style="margin:8px 0 0;font-size:26px;font-weight:700;color:#1f1535;line-height:1.1;letter-spacing:-0.03em;">${config.title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:15px;color:#2f2a35;">${greeting}</p>
              <p style="margin:0 0 16px;font-size:15px;color:#3a3140;line-height:1.6;">
                ${config.emailTemplate.verificationIntro}
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#3a3140;line-height:1.6;">
                This link expires in 48 hours.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#6d28d9;">
                    <a href="${opts.verifyUrl}"
                       style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.02em;border-radius:8px;">
                      Confirm my email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#8b7fa0;line-height:1.6;">
                If you didn't sign up for this, you can safely ignore this email — nothing will happen.
              </p>
              <p style="margin:16px 0 0;font-size:12px;color:#8b7fa0;line-height:1.6;">
                Or copy this link into your browser:<br/>
                <span style="color:#6d28d9;word-break:break-all;">${opts.verifyUrl}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e9d5ff;padding:20px 40px;">
              <p style="margin:0;font-size:11px;color:#a094b0;line-height:1.6;">
                Vibrations Violin Studio · Globeville, Denver, CO<br/>
                You're receiving this because you signed up at vibesviolin.studio.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${greeting}

${config.emailTemplate.verificationIntro}

Please confirm your email address by clicking the link below:
${opts.verifyUrl}

This link expires in 48 hours.

If you didn't sign up for this, you can safely ignore this email.

— Vibrations Violin Studio, Globeville, Denver, CO`;

  return { subject, html, text };
}

export function buildNotificationEmail(
  config: InquiryConfig,
  fields: FieldValues
): { subject: string; html: string; text: string } {
  const email = String(fields.email ?? '');
  const subject = `${config.emailTemplate.notificationSubjectPrefix}: ${email}`;

  const rows = config.fields
    .filter((f) => f.name !== 'email')
    .map((f) => ({ label: f.label, value: fields[f.name] ?? 'not provided' }));

  const html = `<p>A new ${config.title} submission just verified their email.</p>
<ul>
  <li><strong>Email:</strong> ${email}</li>
  ${rows.map((r) => `<li><strong>${r.label}:</strong> ${r.value}</li>`).join('\n  ')}
</ul>`;

  const text = `New ${config.title} verified submission:\nEmail: ${email}\n${rows
    .map((r) => `${r.label}: ${r.value}`)
    .join('\n')}`;

  return { subject, html, text };
}
