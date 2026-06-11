export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { resend, buildVerificationEmail } from '../../lib/resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://vibesviolinstudio.vercel.app';
const FROM_EMAIL = import.meta.env.BETA_FROM_EMAIL ?? 'onboarding@resend.dev';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const redirect = (path: string) =>
    new Response(null, { status: 302, headers: { Location: path } });

  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    return redirect('/practice-pals/beta?error=invalid');
  }

  // ── Honeypot ──
  const honeypot = body.get('website');
  if (honeypot && String(honeypot).trim() !== '') {
    // Silent discard — bot filled the hidden field
    return redirect('/practice-pals/beta/pending');
  }

  const email = String(body.get('email') ?? '').trim().toLowerCase();
  const name = String(body.get('name') ?? '').trim() || null;
  const role = String(body.get('role') ?? '').trim() || null;

  // ── Email validation ──
  if (!email || !EMAIL_RE.test(email)) {
    return redirect('/practice-pals/beta?error=email');
  }

  // ── Valid roles ──
  const validRoles = ['parent', 'adult_learner', 'violin_teacher', 'other'];
  const cleanRole = role && validRoles.includes(role) ? role : null;

  // ── IP rate limit: max 3 attempts per IP per 60 minutes ──
  const ip = clientAddress ?? 'unknown';
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount } = await supabase
    .from('beta_signups')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo);

  if ((recentCount ?? 0) >= 3) {
    return redirect('/practice-pals/beta?error=ratelimit');
  }

  // ── Check for existing signup ──
  const { data: existing } = await supabase
    .from('beta_signups')
    .select('id, verified, token, token_expires')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    if (existing.verified) {
      return redirect('/practice-pals/beta/already');
    }
    // Unverified — resend the verification email with existing or refreshed token
    const token = existing.token;
    const verifyUrl = `${SITE_URL}/practice-pals/beta/verify?token=${token}`;
    const emailContent = buildVerificationEmail({ name, verifyUrl });
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
    return redirect('/practice-pals/beta/pending');
  }

  // ── New signup ──
  const token = crypto.randomUUID() + '-' + crypto.randomUUID();
  const tokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from('beta_signups').insert({
    email,
    name,
    role: cleanRole,
    token,
    token_expires: tokenExpires,
    verified: false,
    ip_address: ip,
  });

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    return redirect('/practice-pals/beta?error=server');
  }

  // ── Send verification email ──
  const verifyUrl = `${SITE_URL}/practice-pals/beta/verify?token=${token}`;
  const emailContent = buildVerificationEmail({ name, verifyUrl });

  const { error: emailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  if (emailError) {
    console.error('Resend error:', emailError);
    // Clean up the row so they can try again
    await supabase.from('beta_signups').delete().eq('email', email);
    return redirect('/practice-pals/beta?error=server');
  }

  return redirect('/practice-pals/beta/pending');
};
