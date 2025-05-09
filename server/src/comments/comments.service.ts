import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(taskId: number, createCommentDto: CreateCommentDto) {
    const data = await this.prismaService.comments.create({
      data: {
        comment: createCommentDto.comment,
        task: {
          connect: {
            id: taskId,
          },
        },
      },
    });
    return data;
  }
}
