import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateJournalDto, UpdateJournalDto } from "./journal.dto.js";
import type { CursorPaginationQuery } from "./journal.type.js";

@Injectable()
export class JournalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateJournalDto) {
    return this.prisma.journal.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string, query: CursorPaginationQuery) {
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    
    return this.prisma.journal.findMany({
      where: { userId },
      take: limit + 1, 
      ...(query.cursor
        ? {
            cursor: { id: query.cursor },
            skip: 1,
          }
        : {}),
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.journal.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateJournalDto) {
    return this.prisma.journal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.journal.delete({
      where: { id },
    });
  }
}
