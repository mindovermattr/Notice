import { Module } from "@nestjs/common";
import { YandexDiskModule } from "src/YandexDisc/yandexDisk.module";
import { CommentsModule } from "src/comments/comments.module";
import { PrismaService } from "src/prisma.service";
import { ProjectService } from "src/project/project.service";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  imports: [CommentsModule, YandexDiskModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, ProjectService],
  exports: [TaskService],
})
export class TaskModule {}
