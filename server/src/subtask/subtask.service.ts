import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateSubtaskDto } from "./dto/create-subtask.dto";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto";

@Injectable()
export class SubtaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(taskId: number, createSubtaskDto: CreateSubtaskDto) {
    const data = await this.prismaService.subTask.create({
      data: {
        title: createSubtaskDto.title,
        task: {
          connect: {
            id: taskId,
          },
        },
      },
    });
    return data;
  }

  async findAll(taskId: number) {
    const data = await this.prismaService.subTask.findMany({
      where: {
        task: {
          id: taskId,
        },
      },
    });

    return data;
  }

  async findOne(id: number) {
    const data = await this.prismaService.subTask.findMany({
      where: {
        id,
      },
    });
    return data;
  }

  async update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
    return `This action updates a #${id} subtask`;
  }

  async remove(id: number) {
    const data = this.prismaService.subTask.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}
