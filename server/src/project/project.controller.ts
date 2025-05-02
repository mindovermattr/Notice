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
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

@Controller("project")
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
  findOne(@Param("projId") id: string, @Req() req) {
    return this.projectService.findOne(+id, req.user);
  }

  @Patch(":projId")
  @Roles(Role.USER)
  update(
    @Param("projId") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(+id, updateProjectDto);
  }

  //@Patch(":id")

  @Delete(":projId")
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param("projId") id: string) {
    return this.projectService.remove(+id);
  }
}
