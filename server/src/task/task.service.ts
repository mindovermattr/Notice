import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EStatus } from "src/enums/status";
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
    const list = await this.prismaService.listTasks.findFirst({
      where: {
        id: listId,
      },
    });

    if (!list)
      throw new HttpException(
        "Списка задач не существует",
        HttpStatus.BAD_REQUEST,
      );

    const data = await this.prismaService.task.create({
      data: {
        task_list: {
          connect: {
            id: listId,
          },
        },
        status: EStatus.TODO,
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
      },
    });

    if (!data)
      throw new HttpException(
        "Ошибка при создании задачи",
        HttpStatus.BAD_REQUEST,
      );
    return data;
  }

  async findAll(projectId: number, listId: number) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.findMany({
      where: {
        task_list_id: listId,
      },
      include: {
        subtasks: true,
      },
    });
    return data;
  }

  async findOne(projectId: number, id: number, listId: number) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project)
      throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.task.findFirst({
      where: {
        task_list_id: listId,
        id,
      },
      include: {
        subtasks: true,
      },
    });
    return data;
  }

  async update(projectId: number, id: number, updateTaskDto: UpdateTaskDto) {
    // const project = await this.prismaService.task.findFirst({
    //   where: {
    //     project_id: projectId,
    //   },
    // });
    // if (!project)
    //   throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);
    // const data = await this.prismaService.task.update({
    //   data: { ...updateTaskDto },
    //   where: {
    //     project_id: projectId,
    //     id,
    //   },
    //   include: {
    //     subtasks: true,
    //   },
    // });
    // return data;
  }

  async remove(projectId: number, id: number) {
    // const project = await this.prismaService.task.findFirst({
    //   where: {
    //     project_id: projectId,
    //   },
    // });
    // if (!project)
    //   throw new HttpException("Project doesn't exist", HttpStatus.BAD_REQUEST);
    // const data = await this.prismaService.task.delete({
    //   where: {
    //     project_id: projectId,
    //     id,
    //   },
    // });
    // return data;
  }
}
