import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthModule } from "../auth/auth.module.js";
import HabitController from "./habit.controller.js";
import HabitService from "./habit.service.js";
import HabitRepository from "./habit.repository.js";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [HabitController],
  providers: [HabitService, HabitRepository],
  exports: [HabitService],
})
export class HabitModule {}