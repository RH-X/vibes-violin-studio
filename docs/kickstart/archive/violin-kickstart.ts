import type { InquiryConfig } from '../inquiry/types';

export const violinKickstartConfig: InquiryConfig = {
  slug: 'violin-kickstart',
  table: 'violin_kickstart_waitlist',
  // Status/verify pages reuse the generic /inquiry/[slug]/* routes — no dedicated
  // pages needed for this inquiry. The form itself lives at /violin-kickstart,
  // so errors redirect there via formPath below.
  basePath: '/inquiry/violin-kickstart',
  formPath: '/violin-kickstart',
  backHref: '/violin-kickstart',
  title: 'Violin Kickstart',
  subtitle: 'A 4-Week Cohort for Adult Beginners and Returning Players',
  intro: {
    label: 'Join the Violin Kickstart Waitlist',
    heading: 'Be the first to know when the next cohort opens.',
    paragraphs: [
      "Whether you're starting violin for the first time or returning after time away, Violin Kickstart is designed to meet you where you are.",
      "Enrollment isn't currently open. Join the waitlist and I'll personally follow up with dates, pricing, and enrollment details as soon as the next cohort is announced.",
      "I keep each cohort intentionally small so I can give every participant meaningful individual attention and personalized feedback.",
    ],
  },
  buttonText: 'Join the Waitlist',
  consentText: "Share a little about where you're starting so I can support you well. I'll personally follow up when the next cohort is announced — no spam, ever.",
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
      name: 'played_before',
      label: 'Have you ever played violin before?',
      type: 'radio',
      optionalLabel: '(optional)',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      name: 'has_violin_access',
      label: 'Do you currently have access to a violin?',
      type: 'radio',
      optionalLabel: '(optional)',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not_yet', label: 'Not yet' },
      ],
    },
    {
      name: 'preferred_cohort_time',
      label: 'What time would generally work best for you to join a live cohort?',
      type: 'radio',
      required: false,
      helperText: 'Optional — this helps me plan future Violin Kickstart sessions.',
      options: [
        { value: 'weekday_mornings', label: 'Weekday mornings' },
        { value: 'weekday_afternoons', label: 'Weekday afternoons' },
        { value: 'weekday_evenings', label: 'Weekday evenings' },
        { value: 'saturday_mornings', label: 'Saturday mornings' },
        { value: 'saturday_afternoons', label: 'Saturday afternoons' },
        { value: 'sunday_afternoons', label: 'Sunday afternoons' },
        { value: 'availability_varies', label: 'My availability varies' },
      ],
    },
    {
      name: 'six_month_goal',
      label: 'What would you most love to be able to do six months from now if you started learning?',
      type: 'textarea',
      optionalLabel: '(optional)',
      placeholder: 'Whatever comes to mind — there are no wrong answers here.',
    },
    {
      name: 'biggest_blocker',
      label: "What's the biggest thing that's kept you from starting until now?",
      type: 'textarea',
      optionalLabel: '(optional)',
      placeholder: 'Time, cost, nerves, not knowing where to start — anything.',
    },
  ],
  notifyEmail: 'vibesviolinstudio@gmail.com',
  emailTemplate: {
    verificationSubject: 'Confirm your Violin Kickstart waitlist signup',
    verificationIntro: "Thanks for joining the Violin Kickstart waitlist. Please confirm your email address so I can follow up when the next cohort is announced.",
    notificationSubjectPrefix: 'New Violin Kickstart waitlist signup',
  },
  turnstile: true,
  successMessage: "Thanks for joining the Violin Kickstart waitlist! Once your email is verified, I'll follow up personally as soon as the next cohort is announced.",
  emailConfirmedMessage: "Thanks for confirming your email. You're on the Violin Kickstart waitlist — Rae will personally follow up as soon as the next cohort is announced.",
};
