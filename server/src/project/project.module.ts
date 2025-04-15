import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectUserController } from "./projectUser.contoller";

@Module({
  controllers: [ProjectController, ProjectUserController],
  providers: [ProjectService, PrismaService],
})
export class ProjectModule {}
