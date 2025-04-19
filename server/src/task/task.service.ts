import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createTaskDto: CreateTaskDto,
    projectId: number,
    listId: number,
  ) {
    const task = await this.prismaService.task.findFirst({
      where: {
        project_id: projectId,
      },
    });

    if (!task)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.create({
      data: {
        task_list: {
          connect: {
            id: listId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
        description: createTaskDto.description,
        due_date: createTaskDto.dueDate,
        title: createTaskDto.title,
        priority: false,
      },
      include: {
        subtasks: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        project_id: false,
      },
    });
    return data;
  }

  async findAll(projectId: number) {
    const project = await this.prismaService.task.findFirst({
      where: {
        project_id: projectId,
      },
    });

    if (!project)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.findMany({
      where: {
        project_id: projectId,
      },
      include: {
        subtasks: true,
      },
    });
    return data;
  }

  async findOne(projectId: number, id: number) {
    const project = await this.prismaService.task.findFirst({
      where: {
        project_id: projectId,
      },
    });

    if (!project)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.findFirst({
      where: {
        project_id: projectId,
        id,
      },
      include: {
        subtasks: true,
      },
    });
    return data;
  }

  async update(projectId: number, id: number, updateTaskDto: UpdateTaskDto) {
    const project = await this.prismaService.task.findFirst({
      where: {
        project_id: projectId,
      },
    });

    if (!project)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.update({
      data: { ...updateTaskDto },
      where: {
        project_id: projectId,
        id,
      },
      include: {
        subtasks: true,
      },
    });
    return data;
  }

  async remove(projectId: number, id: number) {
    const project = await this.prismaService.task.findFirst({
      where: {
        project_id: projectId,
      },
    });

    if (!project)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.delete({
      where: {
        project_id: projectId,
        id,
      },
    });
    return data;
  }
}
