import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Roles } from "src/decorators/roles";
import { Role } from "src/enums/roles";
import { ProjectService } from "./project.service";

@Controller("project/:projectId/users")
@UseGuards(JwtAuthGuard)
export class ProjectUserController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(":id")
  @Roles(Role.ADMIN)
  update(@Param("id") userId: string, @Param("projectId") projectId: string) {
    return this.projectService.addUser(+userId, +projectId);
  }
}
