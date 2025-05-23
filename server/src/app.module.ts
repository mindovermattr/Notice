import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { CommentsModule } from "./comments/comments.module";
import { PrismaService } from "./prisma.service";
import { ProjectModule } from "./project/project.module";
import { SubtaskModule } from "./subtask/subtask.module";
import { TaskModule } from "./task/task.module";
import { TasklistModule } from "./tasklist/tasklist.module";
import { UserModule } from "./user/user.module";
import { YandexDiskModule } from "./YandexDisc/yandexDisk.module";

@Module({
  imports: [
    AuthModule,
    YandexDiskModule,
    UserModule,
    ConfigModule.forRoot(),
    TaskModule,
    ProjectModule,
    SubtaskModule,
    TasklistModule,
    CommentsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
