import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './module/prisma/prisma.module.js';
import { AuthModule } from './module/auth/auth.module.js';
import { UserModule } from './module/users/user.module.js';
import { CategoryModule } from './module/category/category.module.js';
import { TaskModule } from './module/task/task.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    TaskModule
  ],
})
export class AppModule {}
