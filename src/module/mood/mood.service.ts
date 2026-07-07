import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MoodRepository } from "./mood.repository.js";
import { CreateMoodDto, UpdateMoodDto } from "./mood.dto.js";
import { QueryDate } from "./mood.type.js";

@Injectable()
export class MoodService {
  constructor(private readonly repository: MoodRepository) {}

  private formatMood(mood: any) {
    return {
      id: mood.id,
      level: mood.level,
      reason: mood.reason,
      note: mood.note,
      createdAt: mood.createdAt
    }
  }

  async create(userId: string, dto: CreateMoodDto) {
    if (!userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    const create = await this.repository.create(userId, dto);
    return this.formatMood(create);
  }

  async findAll(userId: string, filter: QueryDate) {
    if (!userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);

    const moods = await this.repository.findAll(userId, filter);

    return moods.map(m => this.formatMood(m))
  }

  async update(id: string, userId: string, dto: UpdateMoodDto) {
    if (!userId || !id)
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);

    const mood = await this.repository.findById(id);
    if (!mood) throw new HttpException("Mood not found", HttpStatus.NOT_FOUND);
    if (mood.userId !== userId)
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

    const update = await this.repository.update(id, dto);
    return this.formatMood(update)
  }

  async delete(id: string, userId: string) {
    if (!userId || !id)
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);

    const mood = await this.repository.findById(id);
    if (!mood) throw new HttpException("Mood not found", HttpStatus.NOT_FOUND);
    if (mood.userId !== userId)
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

    await this.repository.delete(id);
    return { success: true };
  }
}
