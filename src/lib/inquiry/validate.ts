import type { InquiryConfig } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

/** Returns true if the honeypot field was filled — caller should silently discard. */
export function isHoneypotTripped(formData: FormData): boolean {
  const honeypot = formData.get('website');
  return Boolean(honeypot && String(honeypot).trim() !== '');
}

export type FieldValues = Record<string, string | null>;

export interface FieldValidationResult {
  values: FieldValues;
  error: 'email' | 'required' | null;
}

/** Extracts and validates fields from form data per the inquiry config. Radio fields are
 * constrained to their declared option values; anything else becomes null. */
export function extractAndValidateFields(config: InquiryConfig, formData: FormData): FieldValidationResult {
  const values: FieldValues = {};

  for (const field of config.fields) {
    const raw = String(formData.get(field.name) ?? '').trim();

    if (field.type === 'radio') {
      const allowed = field.options?.map((o) => o.value) ?? [];
      const value = allowed.includes(raw) ? raw : null;
      if (field.required && !value) {
        return { values, error: 'required' };
      }
      values[field.name] = value;
      continue;
    }

    if (field.required && !raw) {
      return { values, error: 'required' };
    }

    if (field.type === 'email' && raw && !isValidEmail(raw.toLowerCase())) {
      return { values, error: 'email' };
    }

    values[field.name] = field.type === 'email' ? raw.toLowerCase() : raw || null;
  }

  return { values, error: null };
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string | null, remoteIp: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (import.meta.env.PROD) {
      // Never silently bypass spam protection in production — fail closed.
      console.error('[inquiry] TURNSTILE_SECRET_KEY missing in production; rejecting submission');
      return false;
    }
    // Local/preview without keys configured — fail open so dev isn't blocked, but log loudly.
    console.warn('[inquiry] TURNSTILE_SECRET_KEY not set; skipping Turnstile verification (non-production)');
    return true;
  }

  if (!token) return false;

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }),
  });

  const result = (await response.json()) as { success: boolean };
  return result.success === true;
}
