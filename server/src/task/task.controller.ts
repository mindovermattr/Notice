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
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskService } from "./task.service";

@Controller("project/:projectId/tasklist/:listId/tasks")
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param("projectId") projectId: string,
    @Param("listId") listId: string,
  ) {
    return this.taskService.create(createTaskDto, +projectId, +listId);
  }

  @Get()
  findAll(
    @Param("projectId") projectId: string,
    @Param("listId") listId: string,
  ) {
    return this.taskService.findAll(+projectId, +listId);
  }

  @Get(":id")
  findOne(
    @Param("projectId") projectId: string,
    @Param("id") id: string,
    @Param("listId") listId: string,
  ) {
    return this.taskService.findOne(+projectId, +id, +listId);
  }

  @Patch(":id")
  update(
    @Param("projectId") projectId: string,
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(+projectId, +id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("projectId") projectId: string, @Param("id") id: string) {
    return this.taskService.remove(+projectId, +id);
  }
}
