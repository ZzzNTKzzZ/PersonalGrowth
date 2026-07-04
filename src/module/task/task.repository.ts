import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";
import { TaskStatus } from "../../../generated/prisma/enums.js";
import { TaskFilter } from "./task.type.js";

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        userId: userId,
        ...data,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async filter(filter: TaskFilter, userId: string) {
    const where: any = { userId };
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter.dueDate) {
      where.dueDate = new Date(filter.dueDate);
    }

    return await this.prisma.task.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async task(id: string) {
    return await this.prisma.task.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async update(data: UpdateTaskDto, id: string) {
    const updateData: any = { ...data };
    if (data.status) {
      if (data.status === TaskStatus.DONE) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    return await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.task.delete({
      where: { id },
    });
  }

  async findCategoryById(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }
}
