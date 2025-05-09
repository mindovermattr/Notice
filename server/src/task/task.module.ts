import { Module } from "@nestjs/common";
import { CommentsModule } from "src/comments/comments.module";
import { PrismaService } from "src/prisma.service";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  imports: [CommentsModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  exports: [TaskService],
})
export class TaskModule {}
