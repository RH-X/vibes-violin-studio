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
    label: 'Join the Founding Cohort',
    heading: "You're ready. Save your place.",
    paragraphs: [
      "Whether you're starting violin for the first time or returning after time away, this founding cohort is designed to meet you where you are.",
      "Enrollment is now open for the first Violin Kickstart cohort — $149 through September 6, then $200 through final enrollment on September 18. The cohort begins Tuesday, September 22, meeting live online every Tuesday through October 13, from 5:30–6:40 PM Mountain Time.",
      "I'm keeping this first group intentionally small so I can give each participant meaningful individual attention and personalized feedback.",
    ],
  },
  buttonText: 'Join the Founding Cohort — $149',
  consentText: "Share a little about where you're starting so I can support you well in the cohort. I'll personally follow up with next steps to finish enrolling — no spam, ever.",
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
      label: 'The founding cohort meets Tuesdays, 5:30–6:40 PM Mountain Time. If that doesn’t usually work for you, what time would work best for a future cohort?',
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
    verificationSubject: 'Confirm your spot for Violin Kickstart',
    verificationIntro: "Thanks for requesting your spot in the Violin Kickstart founding cohort. Please confirm your email address so I can follow up with next steps to complete your enrollment.",
    notificationSubjectPrefix: 'New Violin Kickstart enrollment request',
  },
  turnstile: true,
  successMessage: "Thanks for requesting your spot in the Violin Kickstart founding cohort! Once your email is verified, I'll follow up personally with next steps to complete your enrollment.",
  emailConfirmedMessage: "Thanks for confirming your email. You're on your way to the founding cohort — Rae will personally follow up with next steps to complete your enrollment.",
};
