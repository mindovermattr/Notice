import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
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
  createComment(
    @Param("taskId") taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentService.create(+taskId, createCommentDto, req.user);
  }

  @Get("tasks/:taskId/comments")
  findAllComments(@Param("taskId") taskId: string) {
    return this.commentService.findAll(+taskId);
  }

  @Patch("tasks/:id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }
  @Patch("tasks/:id/files")
  @UseInterceptors(FilesInterceptor("files"))
  updateFiles(
    @Param("id") id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.taskService.addFiles(+id, files, req.user);
  }

  @Delete("tasks/:id")
  remove(@Param("projectId") projectId: string, @Param("id") id: string) {
    return this.taskService.remove(+projectId, +id);
  }
}
