import { Injectable } from "@nestjs/common";
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
        tasks: true,
        history: true,
      },
    });
    return data;
  }

  // async findOne(id: number) {
  //   return `This action returns a #${id} tasklist`;
  // }

  // update(id: number, updateTasklistDto: UpdateTasklistDto) {
  //   return `This action updates a #${id} tasklist`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tasklist`;
  // }
}
