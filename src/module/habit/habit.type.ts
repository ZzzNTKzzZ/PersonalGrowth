import { HabitFrequency } from "../../../generated/prisma/enums.js";

export interface HabitRecordResponse {
  id: string;
  completedAt: Date;
}

export interface HabitResponse {
  id: string;
  name: string;
  frequency: HabitFrequency;
  createdAt: Date;
  updatedAt: Date;
  streak: {
    current: number;
    max: number;
  };
  records: HabitRecordResponse[];
}