export interface InquiryFieldOption {
  value: string;
  label: string;
}

export interface InquiryField {
  name: string;
  label: string;
  /** A required checkbox stores the time it was ticked, so name it after a timestamp column. */
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox';
  required?: boolean;
  optionalLabel?: string;
  placeholder?: string;
  autocomplete?: string;
  /** Email fields with verify=true must be confirmed via double opt-in before notification. */
  verify?: boolean;
  options?: InquiryFieldOption[];
  /** Small supporting note rendered under the label/legend, e.g. clarifying how a response will be used. */
  helperText?: string;
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
  /** Use browser validation, and show a busy button that blocks double submits. The server
   * still validates everything. */
  enhancedForm?: boolean;
  /** Also tell the studio when a new signup is saved, before the person confirms by email,
   * so a filtered confirmation email can't lose the lead. */
  notifyOnSubmit?: boolean;
  /** GA4 event fired once on the pending page after a new row is saved. `field` is a radio
   * field whose value is sent as a parameter of the same name. */
  leadEvent?: { name: string; field: string };
  /** Replace the default "received" page copy, which is worded for messages, not lists. */
  receivedCopy?: { label: string; heading: string; body: string };
  /** Save and forward new messages from an already-verified email instead of stopping at
   * "/already". For conversations, not lists, where a repeat signup adds nothing. */
  allowRepeatInquiries?: boolean;
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
