import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import { User } from "../../common/decorator/user.decorator.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import { DayReviewService } from "./day-review.service.js";
import { CreateDayReviewDto, UpdateDayReviewDto } from "./day-review.dto.js";
import type { DayReviewQuery } from "./day-review.type.js";

@Controller("day-reviews")
@UseGuards(JwtAuthGuard)
export class DayReviewController {
  constructor(private readonly service: DayReviewService) {}

  @Post()
  async upsert(@User() user: JwtPayLoad, @Body() dto: CreateDayReviewDto) {
    return this.service.upsert(user.id, dto);
  }

  @Get()
  async findAll(@User() user: JwtPayLoad, @Query() query: DayReviewQuery) {
    return this.service.findAll(user.id, query);
  }

  @Get(":date")
  async findByDate(@Param("date") date: string, @User() user: JwtPayLoad) {
    return this.service.findByDate(user.id, date);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @User() user: JwtPayLoad, @Body() dto: UpdateDayReviewDto) {
    return this.service.update(id, user.id, dto);
  }
}
