import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { YandexDiskController } from "./yandexDisk.contoller";
import { YandexDiskService } from "./yandexDisk.service";

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [YandexDiskController],
  providers: [YandexDiskService],
  exports: [YandexDiskService],
})
export class YandexDiskModule {}
