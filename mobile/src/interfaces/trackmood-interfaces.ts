export type TMoodToday = {
  id: string;
  flag: number;
  point: number;
  comment: string;
};

export type TTrackMood = TMoodToday & { createdAt: string };
