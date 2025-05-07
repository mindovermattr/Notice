import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateTasklistDto } from "./dto/create-tasklist.dto";

@Injectable()
export class TasklistService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTasklistDto: CreateTasklistDto, projId: number) {
    const data = await this.prismaService.listTasks.create({
      data: {
        title: createTasklistDto.title,
        history: {
          create: {
            history: [
              `Карточка была создана ${new Date().toLocaleDateString()}`,
            ],
          },
        },
        project: {
          connect: {
            id: projId,
          },
        },
      },
      include: {
        tasks: {
          include: {
            assign_user: true,
          },
        },
        history: true,
      },
    });

    return data;
  }

  async findAllById(id: number) {
    const data = await this.prismaService.listTasks.findMany({
      where: {
        project: {
          id,
        },
      },
      include: {
        tasks: {
          include: {
            assign_user: true,
            subtasks: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        history: true,
      },
    });

    if (!data)
      throw new HttpException("Проект не найден", HttpStatus.NOT_FOUND);

    return data;
  }

  // async findOne(id: number) {
  //   return `This action returns a #${id} tasklist`;
  // }

  // update(id: number, updateTasklistDto: UpdateTasklistDto) {
  //   return `This action updates a #${id} tasklist`;
  // }

  async remove(id: number) {
    const data = await this.prismaService.listTasks.delete({
      where: {
        id,
      },
    });

    if (!data)
      throw new HttpException("Список не найден", HttpStatus.NOT_FOUND);

    return data;
  }
}
