/** Inquiry Engine analytics event names, fired via the site's existing gtag (GA4) setup
 * loaded in Layout.astro. Centralized here so every inquiry config fires consistent names. */
export const INQUIRY_EVENTS = {
  firstInteraction: 'inquiry_first_interaction',
  verificationEmailSent: 'inquiry_verification_email_sent',
  verificationCompleted: 'inquiry_verification_completed',
  submitted: 'inquiry_submitted',
  turnstileFailed: 'inquiry_turnstile_failed',
  rateLimited: 'inquiry_rate_limited',
} as const;
