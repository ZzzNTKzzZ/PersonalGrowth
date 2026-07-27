import { api } from "@/lib/api";

export interface HabitRecord {
  id: string;
  habitId: string;
  completedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  userId: string;
  records?: HabitRecord[];
  streak?: {
    current: number;
    max: number;
  };
  completionRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitPayload {
  name: string;
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY";
}

export interface UpdateHabitPayload {
  name?: string;
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY";
}

export interface CheckHabitPayload {
  completedAt?: string;
}

export const habitApi = {
  // Lấy tất cả habits + streak
  getHabits: () => api.get<Habit[]>("/habits"),

  // Lấy chi tiết 1 habit
  getHabit: (id: string) => api.get<Habit>(`/habits/${id}`),

  // Tạo habit mới
  createHabit: (payload: CreateHabitPayload) =>
    api.post<Habit>("/habits", payload),

  // Cập nhật thông tin habit
  updateHabit: (id: string, payload: UpdateHabitPayload) =>
    api.patch<Habit>(`/habits/${id}`, payload),

  // Xóa habit
  deleteHabit: (id: string) => api.delete<{ message: string }>(`/habits/${id}`),

  // Check-in tích chọn hoàn thành habit
  checkHabit: (id: string, payload?: CheckHabitPayload) =>
    api.post<HabitRecord>(`/habits/${id}/records`, payload || {}),

  // Hủy check-in habit (uncheck)
  uncheckHabit: (id: string, recordId: string) =>
    api.delete<{ message: string }>(`/habits/${id}/records/${recordId}`),
};
