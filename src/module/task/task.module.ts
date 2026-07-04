import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthModule } from "../auth/auth.module.js";
import TaskController from "./task.controller.js";
import TaskService from "./task.service.js";
import TaskRepository from "./task.repository.js";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TaskModule {}