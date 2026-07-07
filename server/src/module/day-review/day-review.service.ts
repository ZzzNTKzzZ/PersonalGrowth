import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DayReviewRepository } from "./day-review.repository.js";
import { CreateDayReviewDto, UpdateDayReviewDto } from "./day-review.dto.js";
import type { DayReviewQuery, DayReviewResponse } from "./day-review.type.js";

@Injectable()
export class DayReviewService {
  constructor(private readonly repository: DayReviewRepository) {}

  private formatResponse(review: any): DayReviewResponse {
    return {
      id: review.id,
      productivity: review.productivity,
      moodScore: review.moodScore,
      healthScore: review.healthScore,
      satisfaction: review.satisfaction,
      note: review.note,
      reviewDate: review.reviewDate,
      createdAt: review.createdAt,
    };
  }

  async upsert(userId: string, dto: CreateDayReviewDto) {
    const review = await this.repository.upsert(userId, dto);
    return this.formatResponse(review);
  }

  async findAll(userId: string, query: DayReviewQuery) {
    const reviews = await this.repository.findAll(userId, query);
    return reviews.map((r) => this.formatResponse(r));
  }

  async findByDate(userId: string, date: string) {
    const review = await this.repository.findByDate(userId, date);
    if (!review) throw new HttpException("Review not found for this date", HttpStatus.NOT_FOUND);
    return this.formatResponse(review);
  }

  async update(id: string, userId: string, dto: UpdateDayReviewDto) {
    const review = await this.repository.findById(id);
    if (!review) throw new HttpException("Review not found", HttpStatus.NOT_FOUND);
    if (review.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    
    const update = await this.repository.update(id, dto);
    return this.formatResponse(update);
  }
}
