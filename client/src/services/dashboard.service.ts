import { api } from "@/lib/api";

export interface Query {
    data?: string
}

export const dashboardApi = {
    getSummary: (query: Query) => api.get('dashboard/summary', query)
}