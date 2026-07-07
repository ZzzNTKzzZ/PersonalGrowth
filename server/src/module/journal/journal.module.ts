import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { JournalController } from "./journal.controller.js";
import { JournalService } from "./journal.service.js";
import { JournalRepository } from "./journal.repository.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JournalController],
  providers: [JournalService, JournalRepository],
})
export class JournalModule {}
