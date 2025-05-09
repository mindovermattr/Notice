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
import { CommentsService } from "src/comments/comments.service";
import { CreateCommentDto } from "src/comments/dto/create-comment.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskService } from "./task.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly commentService: CommentsService,
  ) {}

  @Get("tasks/:id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(+id);
  }

  @Post("tasks/:taskId/comments")
  create(
    @Param("taskId") taskId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(+taskId, createCommentDto);
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
