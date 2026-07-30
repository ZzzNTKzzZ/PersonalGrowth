import { TaskStatus } from "../../../generated/prisma/enums.js";

export interface TaskResponse {
  id: string;
  name: string;
  description?: string | null;
  status: TaskStatus;
  startTime?: Date | null;
  endTime?: Date | null;
  dueDate?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  category?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
}

export interface TaskFilter {
  status?: TaskStatus;
  categoryId?: string;
  dueDate?: string;
}