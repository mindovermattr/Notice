import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Roles } from "src/decorators/roles";
import { Role } from "src/enums/roles";
import { RolesGuard } from "src/guards/role.guards";
import { TaskService } from "src/task/task.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

@Controller("project")
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req.user);
  }

  @Get("all")
  getAll(@Req() req) {
    return this.projectService.getAll(req.user);
  }

  @Get(":projId")
  getUsers(@Param("projId") id: string) {
    return this.projectService.findAllUsers(+id);
  }

  @Patch(":projId")
  @Roles(Role.USER)
  update(
    @Param("projId") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Get(":id/tasks")
  getAllTasks(@Param("id") id: string) {
    return this.taskService.findAllByProject(+id);
  }

  @Delete(":projId")
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param("projId") id: string) {
    return this.projectService.remove(+id);
  }
}
