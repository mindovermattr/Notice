import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Role } from "src/enums/roles";
import { EStatus } from "../enums/status";
import { PrismaService } from "../prisma.service";
import { ProjectService } from "../project/project.service";
import { YandexDiskService } from "../YandexDisc/yandexDisk.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly yandexDiskService: YandexDiskService,
    private readonly projectService: ProjectService,
  ) {}

  async create(createTaskDto: CreateTaskDto, listId: number) {
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
        assign_user: {
          connect: {
            id: createTaskDto.userId,
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

  async findAll(listId: number) {
    const data = await this.prismaService.task.findMany({
      where: {
        task_list_id: listId,
      },
      include: {
        subtasks: true,
        assign_user: true,
      },
      omit: {
        task_list_id: true,
      },
    });

    if (!data)
      throw new HttpException("Список не найден", HttpStatus.BAD_REQUEST);

    return data;
  }

  async findAllByProject(projectId: number) {
    const data = await this.prismaService.listTasks.findMany({
      where: {
        project: {
          id: projectId,
        },
      },
      include: {
        tasks: {
          include: {
            assign_user: true,
            attachments: true,
            subtasks: {
              orderBy: {
                id: "desc",
              },
            },
            task_list: true,
          },
        },
      },
    });
    const tasks = data.map((el) => el.tasks).flat(1);
    return { tasks };
  }

  async findOne(id: number) {
    const data = await this.prismaService.task.findFirst({
      where: {
        id,
      },
      include: {
        subtasks: {
          orderBy: {
            id: "asc",
          },
        },
        task_list: true,
        assign_user: true,
        attachments: {
          include: {
            user: true,
          },
        },
      },
    });
    return data;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.prismaService.task.findFirst({
      where: {
        id,
      },
    });
    if (!task)
      throw new HttpException(
        "Такой задачи не существует",
        HttpStatus.BAD_REQUEST,
      );

    if (user.id !== task.assign_id && updateTaskDto.role !== Role.ADMIN)
      throw new HttpException(
        "Задача назначена на другого пользователя",
        HttpStatus.BAD_REQUEST,
      );

    const data = await this.prismaService.task.update({
      data: {
        ...updateTaskDto,
      },
      where: {
        id,
      },
      include: {
        subtasks: true,
      },
    });
    return data;
  }

  async addFiles(id: number, files: Express.Multer.File[], user: User) {
    const task = await this.prismaService.task.findFirst({
      where: {
        id,
      },
    });
    if (!task)
      throw new HttpException(
        "Такой задачи не существует",
        HttpStatus.BAD_REQUEST,
      );

    const respFiles = await this.yandexDiskService.uploadMultipleFiles(files);

    const data = await this.prismaService.attachment.createMany({
      data: respFiles.map((el) => {
        return {
          fileUrl: el.imageSrc,
          userId: user.id,
          fileName: el.fileName,
          taskId: id,
        };
      }),
      skipDuplicates: true,
    });
    return data;
  }

  async remove(id: number) {
    const data = await this.prismaService.task.delete({
      where: {
        id,
      },
    });
    return data;
  }
}
