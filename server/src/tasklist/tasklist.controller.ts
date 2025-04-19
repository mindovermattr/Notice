import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateTasklistDto } from "./dto/create-tasklist.dto";
import { TasklistService } from "./tasklist.service";

@Controller("tasklist")
export class TasklistController {
  constructor(private readonly tasklistService: TasklistService) {}

  @Post()
  create(@Body() createTasklistDto: CreateTasklistDto) {
    return this.tasklistService.create(createTasklistDto);
  }

  @Get(":projId")
  findAll(@Param("projId") id: string) {
    return this.tasklistService.findAllById(+id);
  }
}
