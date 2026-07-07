export type DayReviewQuery = {
  startDate?: string;
  endDate?: string;
};

export type DayReviewResponse = {
  id: string;
  productivity: number;
  moodScore: number;
  healthScore: number;
  satisfaction: number;
  note: string | null;
  reviewDate: Date;
  createdAt: Date;
};
