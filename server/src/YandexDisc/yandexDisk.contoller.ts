import {
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { YandexDiskService } from "./yandexDisk.service";

const MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  txt: "text/plain",
  csv: "text/csv",
  json: "application/json",
};

@Controller("yandex-disk")
@UseGuards(JwtAuthGuard)
export class YandexDiskController {
  constructor(private readonly yandexDiskService: YandexDiskService) {}

  @Get("file/:path")
  async getInfo(
    @Param("path") path: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const fileStream = await this.yandexDiskService.getFile(path);

    // Безопасное получение расширения файла
    const lastDotIndex = path.lastIndexOf(".");
    const extension =
      lastDotIndex === -1 ? "bin" : path.slice(lastDotIndex + 1).toLowerCase();

    const fileName = path.split("/").pop() || "file";

    res.set({
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    });

    return new StreamableFile(fileStream);
  }
}
