import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(taskId: number, createCommentDto: CreateCommentDto, user: User) {
    const data = await this.prismaService.comment.create({
      data: {
        comment: createCommentDto.comment,
        task: {
          connect: {
            id: taskId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return data;
  }

  async findAll(taskId: number) {
    const data = await this.prismaService.comment.findMany({
      where: {
        task_id: taskId,
      },
      include: {
        user: true,
      },
    });

    return data;
  }
}
