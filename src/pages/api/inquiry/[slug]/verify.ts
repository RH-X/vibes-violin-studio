export const prerender = false;

import type { APIRoute } from 'astro';
import { getInquiryConfig } from '../../../../lib/inquiries';
import { findByToken, formErrorLocation, markVerified, unmarkVerified } from '../../../../lib/inquiry/submissions';
import { buildNotificationEmail, resend } from '../../../../lib/inquiry/email';

const FROM_EMAIL = import.meta.env.BETA_FROM_EMAIL ?? 'onboarding@resend.dev';

export const GET: APIRoute = async ({ params, url }) => {
  const config = getInquiryConfig(params.slug ?? '');
  if (!config) {
    return new Response(null, { status: 404 });
  }

  const redirect = (path: string) =>
    new Response(null, { status: 302, headers: { Location: `${config.basePath}${path}` } });
  const redirectToForm = (errorCode: string) =>
    new Response(null, { status: 302, headers: { Location: formErrorLocation(config, errorCode) } });

  const token = url.searchParams.get('token');
  if (!token || token.trim() === '') {
    return redirect('/invalid');
  }

  const submission = await findByToken(config.table, token);
  if (!submission) {
    return redirect('/invalid');
  }

  if (submission.verified) {
    return redirect('/already');
  }

  if (!submission.token_expires || new Date(submission.token_expires) < new Date()) {
    return redirect('/expired');
  }

  // Claim the row first: a database failure then can't reach the studio or show
  // success, and two simultaneous clicks can't both send a notification.
  const { claimed, error: updateError } = await markVerified(config.table, submission.id);
  if (updateError) {
    console.error(`[inquiry:${config.slug}] verify update error:`, updateError);
    return redirectToForm('server');
  }
  if (!claimed) {
    return redirect('/already');
  }

  // ── Notify the studio of the new verified submission ──
  const notif = buildNotificationEmail(config, submission as Record<string, string | null>);
  const { error: notifError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: config.notifyEmail,
    subject: notif.subject,
    html: notif.html,
    text: notif.text,
  });
  if (notifError) {
    console.error(`[inquiry:${config.slug}] notification email error:`, notifError);
    // The studio never got this, so don't report success. Reopen the row so the same
    // link, or a resubmission, can retry.
    const { error: revertError } = await unmarkVerified(config.table, submission.id, submission.token_expires);
    if (revertError) {
      console.error(`[inquiry:${config.slug}] verify revert error:`, revertError);
    }
    return redirectToForm('server');
  }

  return redirect('/success');
};
