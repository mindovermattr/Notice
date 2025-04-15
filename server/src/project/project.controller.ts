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
    return this.projectService.create(createProjectDto, +req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(":id")
  @Roles(Role.USER)
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  //@Patch(":id")

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id);
  }
}
