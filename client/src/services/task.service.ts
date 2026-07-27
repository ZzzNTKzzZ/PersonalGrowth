import { api } from "@/lib/api";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  completedAt?: string | null;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
}

export interface TaskFilterParams {
  status?: TaskStatus;
  categoryId?: string;
  dueDate?: string;
}

export interface CreateTaskPayload {
  name: string;
  description?: string;
  dueDate?: string;
  categoryId?: string;
}

export interface UpdateTaskPayload {
  name?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  categoryId?: string | null;
}

export const taskApi = {
  // Lấy danh sách tasks (lọc theo query params)
  getTasks: (params?: TaskFilterParams) =>
    api.get<Task[]>("/tasks", params as Record<string, string>),

  // Lấy chi tiết 1 task
  getTask: (id: string) => api.get<Task>(`/tasks/${id}`),

  // Tạo task mới
  createTask: (payload: CreateTaskPayload) =>
    api.post<Task>("/tasks", payload),

  // Cập nhật task
  updateTask: (id: string, payload: UpdateTaskPayload) =>
    api.patch<Task>(`/tasks/${id}`, payload),

  // Xóa task
  deleteTask: (id: string) => api.delete<{ message: string }>(`/tasks/${id}`),
};
