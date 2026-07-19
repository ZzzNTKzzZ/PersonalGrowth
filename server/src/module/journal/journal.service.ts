import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JournalRepository } from "./journal.repository.js";
import { CreateJournalDto, UpdateJournalDto } from "./journal.dto.js";
import type { CursorPaginationQuery, JournalResponse } from "./journal.type.js";

@Injectable()
export class JournalService {
  constructor(private readonly repository: JournalRepository) {}

  private formatJournal(journal: any): JournalResponse {
    return {
      id: journal.id,
      name: journal.name,
      content: journal.content,
      imageUrl: journal.imageUrl,
      createdAt: journal.createdAt,
      updatedAt: journal.updatedAt,
    };
  }

  async create(userId: string, dto: CreateJournalDto) {
    const create = await this.repository.create(userId, dto);
    return this.formatJournal(create);
  }

  async findAll(userId: string, query: CursorPaginationQuery) {
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const journals = await this.repository.findAll(userId, query);

    let nextCursor: string | null = null;
    
    // Nếu số lượng bản ghi trả về > limit (nhờ trò take: limit + 1 ở Repo)
    if (journals.length > limit) {
      const nextItem = journals.pop(); // Cắt bỏ bản ghi dư thừa
      if (nextItem) {
        nextCursor = nextItem.id; // Lấy ID của bản ghi dư thừa làm cursor cho trang sau
      }
    }

    return {
      data: journals.map((j) => this.formatJournal(j)),
      meta: {
        nextCursor,
        limit,
      },
    };
  }

  async findById(id: string, userId: string) {
    const journal = await this.repository.findById(id);
    if (!journal) throw new HttpException("Journal not found", HttpStatus.NOT_FOUND);
    if (journal.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    
    return this.formatJournal(journal);
  }

  async update(id: string, userId: string, dto: UpdateJournalDto) {
    const journal = await this.repository.findById(id);
    if (!journal) throw new HttpException("Journal not found", HttpStatus.NOT_FOUND);
    if (journal.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    
    const update = await this.repository.update(id, dto);
    return this.formatJournal(update);
  }

  async delete(id: string, userId: string) {
    const journal = await this.repository.findById(id);
    if (!journal) throw new HttpException("Journal not found", HttpStatus.NOT_FOUND);
    if (journal.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    
    await this.repository.delete(id);
    return { success: true };
  }
}
