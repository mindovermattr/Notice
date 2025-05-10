import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { YandexDiskController } from "./yandexDisk.contoller";
import { YandexDiskService } from "./yandexDisk.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [YandexDiskController],
  providers: [YandexDiskService],
  exports: [YandexDiskService],
})
export class YandexDiskModule {}
