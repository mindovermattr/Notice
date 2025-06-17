import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

  @Get()
  getRole(@Param("projId") projectId: string, @Body() body: { id: number }) {
    return this.projectService.getUserRole(+projectId, body.id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Param("projId") projectId: string, @Body() body: { email: string }) {
    return this.projectService.addUser(+projectId, body.email);
  }

  @Delete(":id")
  delete(@Param("projId") projectId: string, @Param("id") userId: string) {
    return this.projectService.removeUser(+projectId, +userId);
  }

  @Patch()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  changeRole(
    @Param("projId") projectId: string,
    @Body() body: { id: number; role: Role },
  ) {
    return this.projectService.changeRole(+projectId, body.id, body.role);
  }
}
