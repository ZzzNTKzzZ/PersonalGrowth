import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import { User } from "../../common/decorator/user.decorator.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import { MoodService } from "./mood.service.js";
import { CreateMoodDto, UpdateMoodDto } from "./mood.dto.js";
import type { QueryDate } from "./mood.type.js";

@Controller("moods")
@UseGuards(JwtAuthGuard)
export class MoodController {
  constructor(private readonly service: MoodService) {}

  @Post()
  async create(@User() user: JwtPayLoad, @Body() dto: CreateMoodDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  async findAll(@User() user: JwtPayLoad,@Query() query: QueryDate) {
    return this.service.findAll(user.id, query);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @User() user: JwtPayLoad, @Body() dto: UpdateMoodDto) {
    return this.service.update(id, user.id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @User() user: JwtPayLoad) {
    return this.service.delete(id, user.id);
  }
}
