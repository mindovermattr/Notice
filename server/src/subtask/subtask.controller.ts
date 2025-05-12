import { Body, Controller, Param, Post } from "@nestjs/common";
import { CreateSubtaskDto } from "./dto/create-subtask.dto";
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
}
