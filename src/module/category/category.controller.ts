import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import { User } from "../../common/decorator/user.decorator.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import CategoryService from "./category.service.js";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";

@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async categories(@User() user: JwtPayLoad) {
    return this.service.categories(user.id);
  }
  @Get(":id")
  async category(@Param("id") id: string, @User() user: JwtPayLoad) {
    return this.service.category(id, user.id);
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto, @User() user: JwtPayLoad) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  async update(
    @Body() dto: UpdateCategoryDto,
    @Param("id") id: string,
    @User() user: JwtPayLoad,
  ) {
    return this.service.update(dto, id, user.id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @User() user: JwtPayLoad) {
    return this.service.delete(id, user.id);
  }
}
