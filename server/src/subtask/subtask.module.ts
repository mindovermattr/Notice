import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { SubtaskController } from "./subtask.controller";
import { SubtaskService } from "./subtask.service";

@Module({
  controllers: [SubtaskController],
  providers: [SubtaskService, PrismaService],
})
export class SubtaskModule {}
