export interface InquiryFieldOption {
  value: string;
  label: string;
}

export interface InquiryField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'radio';
  required?: boolean;
  optionalLabel?: string;
  placeholder?: string;
  autocomplete?: string;
  /** Email fields with verify=true must be confirmed via double opt-in before notification. */
  verify?: boolean;
  options?: InquiryFieldOption[];
}

export interface InquiryEmailTemplate {
  verificationSubject: string;
  verificationIntro: string;
  notificationSubjectPrefix: string;
}

export interface InquiryConfig {
  /** URL slug, used as /api/inquiry/{slug}/submit and the route key. */
  slug: string;
  /** Supabase table backing this inquiry. */
  table: string;
  /** Page base path, e.g. /practice-pals/beta — status pages live at {basePath}/pending etc. */
  basePath: string;
  /** Where the form itself lives, for error-query redirects. Defaults to basePath
   * when the form has its own dedicated route (e.g. practice-pals). Set explicitly
   * when the form is embedded in a page that differs from basePath (e.g. contact). */
  formPath?: string;
  title: string;
  subtitle: string;
  intro: {
    label: string;
    heading: string;
    paragraphs: string[];
  };
  buttonText: string;
  consentText: string;
  fields: InquiryField[];
  notifyEmail: string;
  emailTemplate: InquiryEmailTemplate;
  /** Set false to skip the Turnstile widget for this inquiry. */
  turnstile?: boolean;
  /** Shown on the "pending" status page right after submission, before email verification completes.
   * Falls back to a generic message if omitted (see practice-pals' dedicated pending.astro). */
  successMessage?: string;
  /** Heading on the "success" status page after email verification completes.
   * Falls back to "Email confirmed" if omitted. */
  emailConfirmedHeading?: string;
  /** Body text on the "success" status page after email verification completes.
   * Falls back to a generic "Your {title} has been sent" message if omitted. */
  emailConfirmedMessage?: string;
  /** Where the generic status pages (pending/success/invalid/expired/already) link back to. Defaults to "/". */
  backHref?: string;
}
