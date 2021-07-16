export default [
  {
    question:
      'Have you experienced any of the following symptoms in the past 10 days?',
    multiSelect: true,
    critical: true,
    questionOrder: 1,
  },
  {
    question:
      'Have you had face-to-face contact with a probable or confirmed COVID-19 for the past 14 days?',
    multiSelect: false,
    critical: true,
    questionOrder: 2,
  },
  {
    question:
      'Have you provided direct care for a patient with a probable or confirmed COVID-19 case for the past 14 days?',
    multiSelect: false,
    critical: true,
    questionOrder: 3,
  },
  {
    question: 'Have you travelled outside the Philippines in the last 14 days?',
    multiSelect: false,
    critical: true,
    questionOrder: 4,
  },
];
