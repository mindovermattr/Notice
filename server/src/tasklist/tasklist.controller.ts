import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Roles } from "src/decorators/roles";
import { Role } from "src/enums/roles";
import { CreateTasklistDto } from "./dto/create-tasklist.dto";
import { TasklistService } from "./tasklist.service";

@Controller("project/:projId/tasklist")
@UseGuards(JwtAuthGuard)
export class TasklistController {
  constructor(private readonly tasklistService: TasklistService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createTasklistDto: CreateTasklistDto,
    @Param("projId") id: string,
  ) {
    return this.tasklistService.create(createTasklistDto, +id);
  }

  @Get()
  findAll(@Param("projId") id: string) {
    return this.tasklistService.findAllById(+id);
  }
}
