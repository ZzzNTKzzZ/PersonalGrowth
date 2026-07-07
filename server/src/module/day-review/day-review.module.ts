import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { DayReviewController } from "./day-review.controller.js";
import { DayReviewService } from "./day-review.service.js";
import { DayReviewRepository } from "./day-review.repository.js";

@Module({
  imports: [PrismaModule],
  controllers: [DayReviewController],
  providers: [DayReviewService, DayReviewRepository],
})
export class DayReviewModule {}
