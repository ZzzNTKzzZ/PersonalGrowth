import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './module/prisma/prisma.module.js';
import { AuthModule } from './module/auth/auth.module.js';
import { UserModule } from './module/users/user.module.js';
import { CategoryModule } from './module/category/category.module.js';
import { TaskModule } from './module/task/task.module.js';
import { HabitModule } from './module/habit/habit.module.js';
import { MoodModule } from './module/mood/mood.module.js';
import { JournalModule } from './module/journal/journal.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    TaskModule,
    HabitModule,
    MoodModule,
    JournalModule
  ],
})
export class AppModule {}
