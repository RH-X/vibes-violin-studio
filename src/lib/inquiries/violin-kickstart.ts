import type { InquiryConfig } from '../inquiry/types';

export const violinKickstartConfig: InquiryConfig = {
  slug: 'violin-kickstart',
  table: 'violin_kickstart_waitlist',
  // Status/verify pages reuse the generic /inquiry/[slug]/* routes — no dedicated
  // pages needed for this inquiry. The form itself lives at /violin-kickstart,
  // so errors redirect there via formPath below.
  basePath: '/inquiry/violin-kickstart',
  formPath: '/violin-kickstart#waitlist',
  backHref: '/violin-kickstart',
  title: 'Violin Kickstart',
  subtitle: 'Waitlist for January 2027',
  intro: {
    label: 'Join the Waitlist',
    heading: 'Hear first when January enrollment opens.',
    paragraphs: [
      "Tell me which experience interests you most. I'll share the free Q&A invitation and January enrollment details as soon as they're ready.",
    ],
  },
  buttonText: 'Join the Waitlist',
  consentText: 'Joining the waitlist does not reserve a seat or require payment.',
  fields: [
    {
      name: 'name',
      label: 'Your name',
      type: 'text',
      required: true,
      autocomplete: 'name',
    },
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      required: true,
      verify: true,
      autocomplete: 'email',
      placeholder: 'you@example.com',
    },
    {
      name: 'program_interest',
      label: 'Which experience interests you most?',
      type: 'radio',
      required: true,
      options: [
        { value: 'weekly', label: 'Violin Kickstart — once weekly' },
        { value: 'intensive', label: 'Kickstart Intensive — twice weekly' },
        { value: 'unsure', label: "I'm not sure yet — send me both" },
      ],
    },
    {
      name: 'email_consent_at',
      label: 'Email me Kickstart updates, the free Q&A invitation, and enrollment details.',
      type: 'checkbox',
      required: true,
    },
  ],
  notifyEmail: 'vibesviolinstudio@gmail.com',
  emailTemplate: {
    verificationSubject: 'Confirm your Violin Kickstart waitlist signup',
    verificationIntro: "Thanks for joining the Violin Kickstart waitlist. Please confirm your email address so I can send you the free Q&A invitation and January enrollment details.",
    notificationSubjectPrefix: 'New Violin Kickstart waitlist signup',
  },
  turnstile: true,
  enhancedForm: true,
  // Earlier signups can return to choose a January offer, and the studio hears about
  // new signups straight away.
  allowRepeatInquiries: true,
  notifyOnSubmit: true,
  leadEvent: { name: 'kickstart_waitlist_submit_success', field: 'program_interest' },
  receivedCopy: {
    label: 'Interest saved',
    heading: "You're on the list!",
    body: "I've saved your January choice. I'll share the free Q&A invitation and January enrollment details as soon as they're ready.",
  },
  successMessage: "One more step: click the link in the email I just sent to finish joining. If you don't see it in a few minutes, please check your spam or promotions folder.",
  emailConfirmedHeading: "You're on the list!",
  emailConfirmedMessage: "I'll share the free Q&A invitation and January enrollment details as soon as they're ready. Joining the waitlist does not reserve a seat or require payment.",
};
