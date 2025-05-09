import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
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

  async findAll() {
    return `This action returns all subtask`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} subtask`;
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
