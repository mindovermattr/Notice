import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Roles } from "src/decorators/roles";
import { Role } from "src/enums/roles";
import { CreateTaskDto } from "src/task/dto/create-task.dto";
import { TaskService } from "src/task/task.service";
import { CreateTasklistDto } from "./dto/create-tasklist.dto";
import { TasklistService } from "./tasklist.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class TasklistController {
  constructor(
    private readonly tasklistService: TasklistService,
    private readonly taskService: TaskService,
  ) {}

  @Post("project/:projId/tasklist")
  @Roles(Role.ADMIN)
  create(
    @Body() createTasklistDto: CreateTasklistDto,
    @Param("projId") id: string,
  ) {
    return this.tasklistService.create(createTasklistDto, +id);
  }

  @Get("project/:projId/tasklist")
  findAll(@Param("projId") id: string) {
    return this.tasklistService.findAllById(+id);
  }

  @Delete("tasklist/:listId")
  remove(@Param("listId") id: string) {
    return this.tasklistService.remove(+id);
  }

  @Post("tasklist/:listId/tasks")
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param("listId") listId: string,
  ) {
    return this.taskService.create(createTaskDto, +listId);
  }

  @Get("tasklist/:listId/tasks")
  findAllTasks(@Param("listId") listId: string) {
    return this.taskService.findAll(+listId);
  }
}
