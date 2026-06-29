import type { InquiryConfig } from '../inquiry/types';

export const practicePalsConfig: InquiryConfig = {
  slug: 'practice-pals',
  table: 'beta_signups',
  basePath: '/practice-pals/beta',
  title: 'Practice Pals',
  subtitle: 'Beta Interest List',
  intro: {
    label: 'What this is',
    heading: 'Be part of shaping Practice Pals',
    paragraphs: [
      "Practice Pals is a practice support tool growing out of real beginner violin student needs. It's not ready yet — but when beta testing opens, I'd love to have thoughtful people involved.",
      "This is an interest list, not a product launch. I'll reach out personally when the time comes.",
    ],
  },
  buttonText: 'Join the Interest List',
  consentText:
    "By signing up, you're joining an early interest list. I'll reach out when beta testing is ready. No spam, ever. Unsubscribe anytime.",
  fields: [
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
      name: 'name',
      label: 'Name',
      type: 'text',
      optionalLabel: '(optional)',
      autocomplete: 'given-name',
      placeholder: 'What should I call you?',
    },
    {
      name: 'role',
      label: 'I am a…',
      type: 'radio',
      optionalLabel: '(optional)',
      options: [
        { value: 'parent', label: 'Parent' },
        { value: 'adult_learner', label: 'Adult learner' },
        { value: 'violin_teacher', label: 'Violin teacher' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'interest',
      label: 'What interests you about Practice Pals?',
      type: 'textarea',
      required: true,
      placeholder: 'Tell me a little about what you’re hoping for…',
    },
  ],
  notifyEmail: 'vibesviolinstudio@gmail.com',
  emailTemplate: {
    verificationSubject: 'Confirm your Practice Pals interest list signup',
    verificationIntro: 'Thanks for signing up to hear about Practice Pals. Please confirm your email address so I know where to reach you when beta testing is ready.',
    notificationSubjectPrefix: 'New Practice Pals signup',
  },
  turnstile: true,
};
