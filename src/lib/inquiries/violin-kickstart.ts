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
  subtitle: 'A 4-Week Beginner Cohort for Adults',
  intro: {
    label: 'Join the Founding Cohort',
    heading: 'Join the Violin Kickstart Founding Cohort Waitlist',
    paragraphs: [
      "Violin Kickstart is a small, low-pressure cohort for adults who have always been curious about violin but have not quite started.",
      "I'll personally contact people on this waitlist when registration opens. Because this is the first cohort, space will be intentionally limited so I can work closely with each participant.",
    ],
  },
  buttonText: 'Join the Founding Cohort Waitlist',
  consentText: "This is a waitlist, not a payment or commitment. I'll reach out personally when registration is ready. No spam, ever.",
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
    verificationSubject: 'Confirm your spot on the Violin Kickstart waitlist',
    verificationIntro: "Thanks for your interest in Violin Kickstart. Please confirm your email address so I know where to reach you as the next cohort comes together.",
    notificationSubjectPrefix: 'New Violin Kickstart waitlist signup',
  },
  turnstile: true,
  successMessage: "Thanks for joining the Violin Kickstart waitlist! Once your email is verified, you'll be on the list — I'll reach out personally as the next cohort date is set.",
  emailConfirmedMessage: "Thanks for confirming your email. Rae has you on the list! Look out for more details to come; they'll be here soon.",
};
