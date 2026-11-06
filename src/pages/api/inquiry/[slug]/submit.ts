export const prerender = false;

import type { APIRoute } from 'astro';
import { getInquiryConfig } from '../../../../lib/inquiries';
import { extractAndValidateFields, isHoneypotTripped, verifyTurnstile } from '../../../../lib/inquiry/validate';
import {
  deleteSubmissionByEmail,
  deleteSubmissionById,
  findByEmail,
  formErrorLocation,
  generateToken,
  insertRepeatSubmission,
  insertSubmission,
  isRateLimited,
  tokenExpiry,
  updatePendingSubmission,
} from '../../../../lib/inquiry/submissions';
import { buildNotificationEmail, buildVerificationEmail, resend } from '../../../../lib/inquiry/email';

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://www.vibesviolin.studio';
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
  // differ from basePath.
  const redirectToForm = (errorCode: string) =>
    new Response(null, { status: 302, headers: { Location: formErrorLocation(config, errorCode) } });

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
        if (!config.allowRepeatInquiries) {
          return redirect('/already');
        }

        // An identical re-send (double-click, retried tab) was already delivered.
        // Checkboxes store a fresh timestamp each time, so they can't be compared.
        const isSameMessage = config.fields
          .filter((field) => field.type !== 'checkbox')
          .every((field) => (existing[field.name] ?? null) === (values[field.name] ?? null));
        if (isSameMessage) {
          return redirect('/received');
        }

        const { id: repeatId, error: repeatError } = await insertRepeatSubmission(config.table, values, ip);
        if (repeatError || !repeatId) {
          console.error(`[inquiry:${config.slug}] repeat insert error:`, repeatError);
          return redirectToForm('server');
        }

        const notif = buildNotificationEmail(config, values, { returning: true });
        const { error: notifError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: config.notifyEmail,
          subject: notif.subject,
          html: notif.html,
          text: notif.text,
        });
        if (notifError) {
          console.error(`[inquiry:${config.slug}] repeat notification error:`, notifError);
          // Remove only this message, so a retry isn't mistaken for an identical re-send.
          const { error: deleteError } = await deleteSubmissionById(config.table, repeatId);
          if (deleteError) {
            console.error(`[inquiry:${config.slug}] repeat cleanup error:`, deleteError);
          }
          return redirectToForm('server');
        }

        return redirect('/received');
      }

      // Still unverified: keep their latest message. A live token is reused so links
      // in earlier emails keep working; an expired one is replaced so they can recover.
      const tokenIsLive =
        existing.token && existing.token_expires && new Date(existing.token_expires) > new Date();
      const token = tokenIsLive ? existing.token! : generateToken();
      const { error: updateError } = await updatePendingSubmission(config.table, existing.id, values, {
        token,
        tokenExpires: tokenExpiry(),
      });
      if (updateError) {
        console.error(`[inquiry:${config.slug}] resubmit update error:`, updateError);
        return redirectToForm('server');
      }

      const verifyUrl = `${SITE_URL}${config.basePath}/verify?token=${token}`;
      const emailContent = buildVerificationEmail(config, { name, verifyUrl });
      const { error: resendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
      if (resendError) {
        console.error(`[inquiry:${config.slug}] resend error:`, resendError);
        return redirectToForm('server');
      }
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

    // The row is saved and the person has their email, so a failed notice mustn't fail the
    // signup. The studio still hears about it when they confirm.
    if (config.notifyOnSubmit) {
      try {
        const notif = buildNotificationEmail(config, values, { unconfirmed: true });
        const { error: notifError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: config.notifyEmail,
          subject: notif.subject,
          html: notif.html,
          text: notif.text,
        });
        if (notifError) console.error(`[inquiry:${config.slug}] signup notification error:`, notifError);
      } catch (notifError) {
        console.error(`[inquiry:${config.slug}] signup notification error:`, notifError);
      }
    }

    // Only a genuinely new, saved inquiry reaches this line. The one-time cookie is
    // what lets /pending fire lead_form_submit (see InquiryStatusCard.astro).
    const response = redirect('/pending');
    if (config.slug === 'contact') {
      response.headers.set('Set-Cookie', `vvs_lead_ok=1; Path=${config.basePath}; Max-Age=120; SameSite=Lax`);
    }
    if (config.leadEvent) {
      // The value comes from a validated radio field, so it's safe in a cookie.
      const leadValue = values[config.leadEvent.field] ?? 'not_selected';
      response.headers.set('Set-Cookie', `vvs_lead_value=${leadValue}; Path=${config.basePath}; Max-Age=120; SameSite=Lax`);
    }
    return response;
  } catch (err) {
    console.error(`[inquiry:${params.slug}] unhandled error:`, err);
    return redirectToForm('server');
  }
};
