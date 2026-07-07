import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import HabitService from "./habit.service.js";
import { User } from "../../common/decorator/user.decorator.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import { CheckHabitDto, CreateHabitDto, UpdateHabitDto } from "./habit.dto.js";

@Controller("/habits")
@UseGuards(JwtAuthGuard)
export default class HabitController {
  constructor(private readonly service: HabitService) {}

  @Post()
  async create(@User() user: JwtPayLoad, @Body() dto: CreateHabitDto) {
    return await this.service.create(dto, user.id);
  }

  @Get()
  async findAll(@User() user: JwtPayLoad) {
    return await this.service.findAll(user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @User() user: JwtPayLoad) {
    return await this.service.findOne(id, user.id);
  }

  @Patch(":id")
  async update(
    @Body() dto: UpdateHabitDto,
    @Param("id") id: string,
    @User() user: JwtPayLoad,
  ) {
    return await this.service.update(dto, id, user.id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @User() user: JwtPayLoad) {
    return await this.service.delete(id, user.id);
  }

  @Post(':id/records')
  async checkHabits(@Param("id") id: string, @User() user: JwtPayLoad, @Body() dto: CheckHabitDto) {
    return await this.service.checkedHabitRecord(id, user.id, dto)
  }

  @Delete(":id/records/:recordId")
  async deleteHabitRecord(@Param("id") id : string, @Param("recordId") recordId: string, @User() user: JwtPayLoad) {
    return await this.service.deleteHabitRecord(id, recordId, user.id)
  }

}
