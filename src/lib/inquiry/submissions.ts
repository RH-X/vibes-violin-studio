import { supabase } from '../supabase';
import type { InquiryConfig } from './types';
import type { FieldValues } from './validate';

export interface SubmissionRow {
  id: string;
  verified: boolean;
  token: string | null;
  token_expires: string | null;
  email: string;
  [key: string]: unknown;
}

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 60;
const TOKEN_TTL_HOURS = 48;

export async function isRateLimited(table: string, ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', windowStart);

  return (count ?? 0) >= RATE_LIMIT_MAX;
}

/** Latest row for an email, preferring a verified one. Throws on a failed read so
 * callers can't mistake a database error for "this email is new". */
export async function findByEmail(table: string, email: string): Promise<SubmissionRow | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('email', email)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function findByToken(table: string, token: string): Promise<SubmissionRow | null> {
  const { data } = await supabase
    .from(table)
    .select('*')
    .eq('token', token)
    .maybeSingle();
  return data ?? null;
}

export function generateToken(): string {
  return crypto.randomUUID() + '-' + crypto.randomUUID();
}

export function tokenExpiry(): string {
  return new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000).toISOString();
}

export async function insertSubmission(
  table: string,
  fields: FieldValues,
  opts: { token: string; tokenExpires: string; ip: string }
): Promise<{ error: unknown }> {
  const { error } = await supabase.from(table).insert({
    ...fields,
    token: opts.token,
    token_expires: opts.tokenExpires,
    verified: false,
    ip_address: opts.ip,
  });
  return { error };
}

/** Saves a new message from an email verified on an earlier inquiry. It has no token
 * because no confirmation step follows. */
export async function insertRepeatSubmission(
  table: string,
  fields: FieldValues,
  ip: string
): Promise<{ id: string | null; error: unknown }> {
  const { data, error } = await supabase
    .from(table)
    .insert({
      ...fields,
      verified: true,
      verified_at: new Date().toISOString(),
      ip_address: ip,
    })
    .select('id')
    .single();
  return { id: data?.id ?? null, error };
}

export async function deleteSubmissionById(table: string, id: string): Promise<{ error: unknown }> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  return { error };
}

/** Applies a resubmission to a still-unverified row: latest form values plus the
 * token and expiry the new verification email will use. */
export async function updatePendingSubmission(
  table: string,
  id: string,
  fields: FieldValues,
  opts: { token: string; tokenExpires: string }
): Promise<{ error: unknown }> {
  const { error } = await supabase
    .from(table)
    .update({ ...fields, token: opts.token, token_expires: opts.tokenExpires })
    .eq('id', id)
    .eq('verified', false);
  return { error };
}

export async function deleteSubmissionByEmail(table: string, email: string): Promise<void> {
  await supabase.from(table).delete().eq('email', email);
}

/** Atomically claims a row as verified. `claimed` is false when another request got
 * there first, so only one request ever goes on to notify the studio. */
export async function markVerified(table: string, id: string): Promise<{ claimed: boolean; error: unknown }> {
  // Intentionally leave `token` in place after verifying: verify.ts looks rows up
  // by token, and a second click on the same email link (browser/email-client
  // prefetch, or a user clicking twice) needs to still find the row so it can
  // redirect to "/already" rather than "/invalid". Replaying the token once
  // verified is harmless — it can only re-trigger the same idempotent check.
  const { data, error } = await supabase
    .from(table)
    .update({ verified: true, verified_at: new Date().toISOString(), token_expires: null })
    .eq('id', id)
    .eq('verified', false)
    .select('id');
  return { claimed: (data?.length ?? 0) > 0, error };
}

/** Undoes markVerified after a failed studio notification, so the same link can retry. */
export async function unmarkVerified(table: string, id: string, tokenExpires: string): Promise<{ error: unknown }> {
  const { error } = await supabase
    .from(table)
    .update({ verified: false, verified_at: null, token_expires: tokenExpires })
    .eq('id', id);
  return { error };
}

/** Where to send someone after a failure: back to the form, with the error code
 * inserted before any #hash. */
export function formErrorLocation(config: InquiryConfig, errorCode: string): string {
  const formPath = config.formPath ?? config.basePath;
  const [base, hash] = formPath.split('#');
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}error=${errorCode}${hash ? `#${hash}` : ''}`;
}
