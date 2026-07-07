import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateDayReviewDto, UpdateDayReviewDto } from "./day-review.dto.js";
import type { DayReviewQuery } from "./day-review.type.js";

@Injectable()
export class DayReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: string, data: CreateDayReviewDto) {
    const reviewDate = new Date(data.reviewDate);
    // Chuẩn hóa thời gian về 00:00:00 UTC để tránh lệch ngày
    reviewDate.setUTCHours(0, 0, 0, 0);

    return this.prisma.dayReview.upsert({
      where: {
        userId_reviewDate: {
          userId,
          reviewDate,
        },
      },
      update: {
        productivity: data.productivity,
        moodScore: data.moodScore,
        healthScore: data.healthScore,
        satisfaction: data.satisfaction,
        note: data.note,
      },
      create: {
        productivity: data.productivity,
        moodScore: data.moodScore,
        healthScore: data.healthScore,
        satisfaction: data.satisfaction,
        note: data.note,
        reviewDate,
        userId,
      },
    });
  }

  async findAll(userId: string, query: DayReviewQuery) {
    let dateFilter = {};
    if (query?.startDate && query?.endDate) {
      dateFilter = {
        reviewDate: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      };
    }

    return this.prisma.dayReview.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: { reviewDate: "desc" },
    });
  }

  async findByDate(userId: string, date: string) {
    const reviewDate = new Date(date);
    reviewDate.setUTCHours(0, 0, 0, 0);
    return this.prisma.dayReview.findUnique({
      where: {
        userId_reviewDate: {
          userId,
          reviewDate,
        },
      },
    });
  }
  
  async findById(id: string) {
    return this.prisma.dayReview.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateDayReviewDto) {
    return this.prisma.dayReview.update({
      where: { id },
      data,
    });
  }
}
