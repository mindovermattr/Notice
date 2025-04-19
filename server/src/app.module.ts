import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { SubtaskModule } from './subtask/subtask.module';
import { TasklistModule } from './tasklist/tasklist.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    TaskModule,
    ProjectModule,
    SubtaskModule,
    TasklistModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
