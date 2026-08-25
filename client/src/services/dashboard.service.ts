import { api } from "@/lib/api";

export interface DashboardSummaryQuery {
  date?: string; // YYYY-MM-DD
}

export interface DashboardSummaryResponse {
  date: string;
  tasks: {
    total: number;
    completed: number;
    completionRate: number;
  };
  habits: {
    total: number;
    completed: number;
    completionRate: number;
  };
}

export const dashboardApi = {
  getSummary: (query?: DashboardSummaryQuery) =>
    api.get<DashboardSummaryResponse>("/dashboard/summary", query as Record<string, string>),
};