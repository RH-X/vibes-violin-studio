export const prerender = false;

import type { APIRoute } from 'astro';
import { getInquiryConfig } from '../../../../lib/inquiries';
import { extractAndValidateFields, isHoneypotTripped, verifyTurnstile } from '../../../../lib/inquiry/validate';
import {
  deleteSubmissionByEmail,
  findByEmail,
  generateToken,
  insertSubmission,
  isRateLimited,
  tokenExpiry,
} from '../../../../lib/inquiry/submissions';
import { buildVerificationEmail, resend } from '../../../../lib/inquiry/email';

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://vibesviolin.studio';
const FROM_EMAIL = import.meta.env.BETA_FROM_EMAIL ?? 'onboarding@resend.dev';

export const POST: APIRoute = async ({ params, request, clientAddress }) => {
  const config = getInquiryConfig(params.slug ?? '');
  if (!config) {
    return new Response(null, { status: 404 });
  }

  // Status pages (pending/already) always live under basePath.
  const redirect = (path: string) =>
    new Response(null, { status: 302, headers: { Location: `${config.basePath}${path}` } });

  // Error redirects go back to where the form itself lives (formPath), which may
  // differ from basePath and may carry a #hash — insert the query before any hash.
  const redirectToForm = (errorCode: string) => {
    const formPath = config.formPath ?? config.basePath;
    const [base, hash] = formPath.split('#');
    const separator = base.includes('?') ? '&' : '?';
    const location = `${base}${separator}error=${errorCode}${hash ? `#${hash}` : ''}`;
    return new Response(null, { status: 302, headers: { Location: location } });
  };

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return redirectToForm('invalid');
    }

    // ── Honeypot ──
    if (isHoneypotTripped(formData)) {
      return redirect('/pending');
    }

    // ── Turnstile ──
    if (config.turnstile) {
      const turnstileToken = String(formData.get('cf-turnstile-response') ?? '');
      const ip = clientAddress ?? 'unknown';
      const passed = await verifyTurnstile(turnstileToken, ip);
      if (!passed) {
        return redirectToForm('turnstile');
      }
    }

    // ── Field validation ──
    const { values, error } = extractAndValidateFields(config, formData);
    if (error) {
      return redirectToForm(error);
    }

    const email = String(values.email ?? '');
    const name = (values.name as string | null) ?? null;

    // ── IP rate limit ──
    const ip = clientAddress ?? 'unknown';
    if (await isRateLimited(config.table, ip)) {
      return redirectToForm('ratelimit');
    }

    // ── Duplicate email check ──
    const existing = await findByEmail(config.table, email);
    if (existing) {
      if (existing.verified) {
        return redirect('/already');
      }
      const verifyUrl = `${SITE_URL}${config.basePath}/verify?token=${existing.token}`;
      const emailContent = buildVerificationEmail(config, { name, verifyUrl });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
      return redirect('/pending');
    }

    // ── New submission ──
    const token = generateToken();
    const { error: insertError } = await insertSubmission(config.table, values, {
      token,
      tokenExpires: tokenExpiry(),
      ip,
    });

    if (insertError) {
      console.error(`[inquiry:${config.slug}] insert error:`, insertError);
      return redirectToForm('server');
    }

    // ── Send verification email ──
    const verifyUrl = `${SITE_URL}${config.basePath}/verify?token=${token}`;
    const emailContent = buildVerificationEmail(config, { name, verifyUrl });

    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (emailError) {
      console.error(`[inquiry:${config.slug}] resend error:`, emailError);
      await deleteSubmissionByEmail(config.table, email);
      return redirectToForm('server');
    }

    return redirect('/pending');
  } catch (err) {
    console.error(`[inquiry:${params.slug}] unhandled error:`, err);
    return redirectToForm('server');
  }
};
