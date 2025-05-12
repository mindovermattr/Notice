import { Module } from "@nestjs/common";
import { CommentsModule } from "src/comments/comments.module";
import { PrismaService } from "src/prisma.service";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { YandexDiskModule } from "src/YandexDisc/yandexDisk.module";

@Module({
  imports: [CommentsModule, YandexDiskModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  exports: [TaskService],
})
export class TaskModule {}
