import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { TaskModule } from "src/task/task.module";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectUserController } from "./projectUser.contoller";

@Module({
  imports: [TaskModule],
  controllers: [ProjectController, ProjectUserController],
  providers: [ProjectService, PrismaService],
})
export class ProjectModule {}
