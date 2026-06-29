import { supabase } from '../supabase';
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

export async function findByEmail(table: string, email: string): Promise<SubmissionRow | null> {
  const { data } = await supabase
    .from(table)
    .select('*')
    .eq('email', email)
    .maybeSingle();
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

export async function deleteSubmissionByEmail(table: string, email: string): Promise<void> {
  await supabase.from(table).delete().eq('email', email);
}

export async function markVerified(table: string, id: string): Promise<{ error: unknown }> {
  // Intentionally leave `token` in place after verifying: verify.ts looks rows up
  // by token, and a second click on the same email link (browser/email-client
  // prefetch, or a user clicking twice) needs to still find the row so it can
  // redirect to "/already" rather than "/invalid". Replaying the token once
  // verified is harmless — it can only re-trigger the same idempotent check.
  const { error } = await supabase
    .from(table)
    .update({ verified: true, verified_at: new Date().toISOString(), token_expires: null })
    .eq('id', id);
  return { error };
}
