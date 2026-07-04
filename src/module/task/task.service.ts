import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import TaskRepository from "./task.repository.js";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";
import { TaskFilter } from "./task.type.js";

@Injectable()
export default class TaskService {
  constructor (private readonly repository: TaskRepository) {}

  async create(dto: CreateTaskDto, userId: string) {
    if(!userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
    
    if (dto.categoryId) {
      const category = await this.repository.findCategoryById(dto.categoryId);
      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }
      if (category.userId !== userId) {
        throw new HttpException("Forbidden category", HttpStatus.FORBIDDEN);
      }
    }

    return await this.repository.create(dto, userId)
  }

  async filter(filter: TaskFilter, userId: string) {
    if(!userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
    return await this.repository.filter(filter, userId)
  }

  async task(id: string, userId: string) {
    if(!id || !userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
    const task = await this.repository.task(id)
    if (!task) throw new HttpException("Task not found", HttpStatus.NOT_FOUND)
    if (task.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
    return task
  }

  async update(dto: UpdateTaskDto, id: string, userId: string) {
    if(!id || !userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
    
    const task = await this.repository.task(id)
    if (!task) throw new HttpException("Task not found", HttpStatus.NOT_FOUND)
    if (task.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)

    if (dto.categoryId) {
      const category = await this.repository.findCategoryById(dto.categoryId);
      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }
      if (category.userId !== userId) {
        throw new HttpException("Forbidden category", HttpStatus.FORBIDDEN);
      }
    }

    return await this.repository.update(dto, id)
  }

  async delete(id: string, userId: string) {
    if(!id || !userId) throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
    
    const task = await this.repository.task(id)
    if (!task) throw new HttpException("Task not found", HttpStatus.NOT_FOUND)
    if (task.userId !== userId) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)

    return await this.repository.delete(id)
  }
}