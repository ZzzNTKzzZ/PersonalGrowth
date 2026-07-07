import { Injectable } from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export default class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto, userId: string) {
    return await this.prisma.category.create({
      data: {
        userId: userId,
        ...data,
      },
    });
  }
  async update(data: UpdateCategoryDto, id: string) {
    return await this.prisma.category.update({
      where: { id },
      data: { ...data },
    });
  }

  async finds(userId: string) {
    return await this.prisma.category.findMany({
      where: { userId },
    });
  }
  async findById(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    await this.prisma.task.updateMany({
      where: { categoryId: id },
      data: {
        categoryId: null,
      },
    });

    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
