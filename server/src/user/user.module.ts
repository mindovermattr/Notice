import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { YandexDiskModule } from "src/YandexDisc/yandexDisk.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [YandexDiskModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
