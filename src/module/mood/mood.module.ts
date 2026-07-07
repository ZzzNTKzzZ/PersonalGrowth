import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { MoodController } from "./mood.controller.js";
import { MoodService } from "./mood.service.js";
import { MoodRepository } from "./mood.repository.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MoodController],
  providers: [MoodService, MoodRepository],
})
export class MoodModule {}
