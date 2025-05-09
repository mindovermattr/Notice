import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CommentsService } from "./comments.service";

@Module({
  providers: [CommentsService, PrismaService],
  exports: [CommentsService],
})
export class CommentsModule {}
