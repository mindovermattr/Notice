import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { TasklistController } from "./tasklist.controller";
import { TasklistService } from "./tasklist.service";
import { TaskModule } from "src/task/task.module";

@Module({
  imports: [TaskModule],
  controllers: [TasklistController],
  providers: [TasklistService, PrismaService],
})
export class TasklistModule {}
