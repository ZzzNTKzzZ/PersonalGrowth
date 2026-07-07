import { MoodLevel } from "../../../generated/prisma/enums.js"

export interface QueryDate {
    startDate?: string
    endDate?: string
}

export interface MoodResponse {
    id: string,
    level: MoodLevel,
    reason: string,
    note?: string,
    createdAt: Date
}