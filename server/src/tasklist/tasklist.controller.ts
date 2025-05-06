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
import { CreateTasklistDto } from "./dto/create-tasklist.dto";
import { TasklistService } from "./tasklist.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class TasklistController {
  constructor(private readonly tasklistService: TasklistService) {}

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
}
