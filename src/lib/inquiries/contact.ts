import type { InquiryConfig } from '../inquiry/types';

export const contactConfig: InquiryConfig = {
  slug: 'contact',
  table: 'contact_inquiries',
  basePath: '/inquiry/contact',
  formPath: '/contact#inquiry-engine',
  title: 'Get in Touch',
  subtitle: "Whether you're exploring lessons for yourself, your child, or another opportunity, I'd love to learn a little about what you're looking for.",
  intro: {
    label: 'Get in Touch',
    heading: 'Get in Touch',
    paragraphs: [
      "Whether you're exploring lessons for yourself, your child, or another opportunity, I'd love to learn a little about what you're looking for.",
    ],
  },
  buttonText: 'Send Inquiry',
  consentText: "Rae reads every message personally and will respond within one business day whenever possible.",
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      autocomplete: 'name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      verify: true,
      autocomplete: 'email',
      placeholder: 'you@example.com',
    },
    {
      name: 'interest',
      label: 'Interest',
      type: 'textarea',
      required: true,
      placeholder: "Tell me a little about what you're looking for, any questions you have, or what prompted you to reach out.",
    },
  ],
  notifyEmail: 'vibesviolinstudio@gmail.com',
  emailTemplate: {
    verificationSubject: 'Confirm your inquiry to Vibrations Violin Studio',
    verificationIntro: "Thanks for reaching out to Vibrations Violin Studio. Please confirm your email address so I know your inquiry is really from you.",
    notificationSubjectPrefix: 'New contact inquiry',
  },
  turnstile: true,
  backHref: '/contact',
  successMessage: "Thanks for reaching out! Once your email has been verified, your inquiry will be sent. I'll respond within one business day whenever possible.",
};
