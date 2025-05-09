import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateSubtaskDto } from "./dto/create-subtask.dto";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto";
import { SubtaskService } from "./subtask.service";

@Controller()
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Post("tasks/:taskId/subtask")
  create(
    @Param("taskId") taskId: string,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.subtaskService.create(+taskId, createSubtaskDto);
  }

  @Get()
  findAll() {
    return this.subtaskService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subtaskService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.subtaskService.update(+id, updateSubtaskDto);
  }

  @Delete("subtask/:id")
  remove(@Param("id") id: string) {
    return this.subtaskService.remove(+id);
  }
}
