import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Roles } from "src/decorators/roles";
import { Role } from "src/enums/roles";
import { RolesGuard } from "src/guards/role.guards";
import { ProjectService } from "./project.service";

@Controller("project/:projId/users")
@UseGuards(JwtAuthGuard)
export class ProjectUserController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param("projId") projectId: string, @Body() body: { email: string }) {
    return this.projectService.addUser(+projectId, body.email);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  delete(@Param("projId") projectId: string, @Param("id") userId: string) {
    return this.projectService.removeUser(+projectId, +userId);
  }
}
