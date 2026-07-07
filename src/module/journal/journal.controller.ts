import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import { User } from "../../common/decorator/user.decorator.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import { JournalService } from "./journal.service.js";
import { CreateJournalDto, UpdateJournalDto } from "./journal.dto.js";
import type { CursorPaginationQuery } from "./journal.type.js";

@Controller("journals")
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly service: JournalService) {}

  @Post()
  async create(@User() user: JwtPayLoad, @Body() dto: CreateJournalDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  async findAll(@User() user: JwtPayLoad, @Query() query: CursorPaginationQuery) {
    return this.service.findAll(user.id, query);
  }

  @Get(":id")
  async findById(@Param("id") id: string, @User() user: JwtPayLoad) {
    return this.service.findById(id, user.id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @User() user: JwtPayLoad, @Body() dto: UpdateJournalDto) {
    return this.service.update(id, user.id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @User() user: JwtPayLoad) {
    return this.service.delete(id, user.id);
  }
}
