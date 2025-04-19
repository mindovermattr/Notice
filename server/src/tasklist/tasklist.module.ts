import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { TasklistController } from "./tasklist.controller";
import { TasklistService } from "./tasklist.service";

@Module({
  controllers: [TasklistController],
  providers: [TasklistService, PrismaService],
})
export class TasklistModule {}
