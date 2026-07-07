import { TaskStatus } from "../../../generated/prisma/enums.js";

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: Date;
  completedAt: null | Date;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    color?: string;
  };
}


export interface TaskFilter {
  status?: TaskStatus
  categoryId?: string
  dueDate?: string 
}