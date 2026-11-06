// The two January 2027 Violin Kickstart offers. `id` stays stable for future checkout
// links; `formValue` is what the waitlist form saves as program_interest. Prices are
// deliberately absent until they're approved.
export const KICKSTART_START_LABEL = 'January 12, 2027';
export const KICKSTART_TIME_LABEL = '5:30 PM Mountain Time (Denver)';

export const KICKSTART_OFFERS = [
  {
    id: 'kickstart_weekly',
    formValue: 'weekly',
    name: 'Violin Kickstart',
    positioning: 'A welcoming introduction',
    message: 'Start strong with a solid foundation, live online.',
    frequency: '1 live session per week',
    schedule: 'Tuesdays',
    dates: 'January 12, 19, 26 and February 2',
    fit: 'Adults who want a guided introduction with one live group session each week.',
    support: [
      'One live group session each week',
      'An optional, recommended check-in with your teacher between sessions: a short update and one question from your practice log',
      'A private lesson available to book at a significant discount',
    ],
  },
  {
    id: 'kickstart_intensive',
    formValue: 'intensive',
    name: 'Kickstart Intensive',
    positioning: 'Your early success map',
    message: 'More live guidance to strengthen early skills and practice habits.',
    frequency: '2 live sessions per week',
    schedule: 'Tuesdays and Thursdays',
    dates: 'January 12 through February 4',
    fit: 'Adults who prefer additional live feedback and reinforcement while learning early violin foundations.',
    support: [
      'Two live group sessions each week, eight in all',
      'A second weekly chance to work together live, in community',
      'A private lesson included',
    ],
  },
] as const;
