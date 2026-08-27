import { api } from "@/lib/api";

export interface DayReview {
  id: string;
  productivity: number;
  moodScore: number;
  healthScore: number;
  satisfaction: number;
  note?: string;
  reviewDate: string;
  createdAt: string;
  userId: string;
}

export interface CreateDayReviewDto {
  productivity: number;
  moodScore: number;
  healthScore: number;
  satisfaction: number;
  note?: string;
  reviewDate: string; // ISO format or YYYY-MM-DD
}

export interface UpdateDayReviewDto {
  productivity?: number;
  moodScore?: number;
  healthScore?: number;
  satisfaction?: number;
  note?: string;
}

export interface DayReviewQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export const dayReviewApi = {
  upsert: (data: CreateDayReviewDto) => api.post<DayReview>("/day-reviews", data),
  getByDate: (date: string) => api.get<DayReview>(`/day-reviews/${date}`),
  getAll: (query?: DayReviewQuery) =>
    api.get<{ data: DayReview[]; meta?: any }>("/day-reviews", query as any),
  update: (id: string, data: UpdateDayReviewDto) =>
    api.patch<DayReview>(`/day-reviews/${id}`, data),
};
