import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateMoodDto, UpdateMoodDto } from "./mood.dto.js";
import { QueryDate } from "./mood.type.js";

@Injectable()
export class MoodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateMoodDto) {
    return this.prisma.mood.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string, query?: QueryDate) {
    let dateFilter = {};

    if (query?.startDate && query?.endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      };
    }

    return this.prisma.mood.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.mood.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateMoodDto) {
    return this.prisma.mood.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.mood.delete({
      where: { id },
    });
  }
}
