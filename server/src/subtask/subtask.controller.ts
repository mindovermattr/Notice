import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
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

  @Delete("subtask/:subtaskId")
  delete(@Param("subtaskId") subtaskId: string) {
    return this.subtaskService.remove(+subtaskId);
  }

  @Patch("subtask/:subtaskId")
  update(
    @Param("subtaskId") subtaskId: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtaskService.update(+subtaskId, updateSubtaskDto);
  }
}
