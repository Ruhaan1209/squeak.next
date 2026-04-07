export const AVAILABLE_TOPICS = [
  'Politics',
  'Business',
  'Technology',
  'Finance',
  'Gaming',
  'Music',
  'Entertainment',
  'NBA',
  'NFL',
  'Football',
] as const;

export type Topic = (typeof AVAILABLE_TOPICS)[number];
