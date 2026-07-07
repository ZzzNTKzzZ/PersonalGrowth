import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { CategoryController } from "./category.controller.js";
import CategoryService from "./category.service.js";
import CategoryRepository from "./category.repository.js";
import { AuthModule } from "../auth/auth.module.js";


@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}