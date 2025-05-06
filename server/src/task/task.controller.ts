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

@Controller()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("tasklist/:listId/tasks")
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param("listId") listId: string,
  ) {
    return this.taskService.create(createTaskDto, +listId);
  }

  @Get("tasklist/:listId/tasks")
  findAll(@Param("listId") listId: string) {
    return this.taskService.findAll(+listId);
  }

  @Get("tasks/:id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch("tasks/:id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete("tasks/:id")
  remove(@Param("projectId") projectId: string, @Param("id") id: string) {
    return this.taskService.remove(+projectId, +id);
  }
}
