import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import TaskService from "./task.service.js";
import { User } from "../../common/decorator/user.decorator.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";
import type { TaskFilter } from "./task.type.js";

@Controller("/tasks")
@UseGuards(JwtAuthGuard)
export default class TaskController {
  constructor (private readonly service: TaskService) {}

  @Post()
  async create(@User() user: JwtPayLoad, @Body() dto: CreateTaskDto) {
    return await this.service.create(dto, user.id)
  }

  @Get()
  async filter(@User() user: JwtPayLoad, @Query() query: TaskFilter) {
    return await this.service.filter(query, user.id)
  }

  @Get(":id")
  async task(@Param("id") id: string, @User() user: JwtPayLoad) {
    return await this.service.task(id, user.id)
  }

  @Patch(':id')
  async update(
    @Body() dto: UpdateTaskDto,
    @Param('id') id: string,
    @User() user: JwtPayLoad,
  ) {
    return await this.service.update(dto, id, user.id)
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: JwtPayLoad) {
    return await this.service.delete(id, user.id)
  }
}

