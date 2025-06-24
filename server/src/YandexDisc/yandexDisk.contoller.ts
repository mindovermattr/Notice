import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
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
} as const;

@Controller("yandex-disk")
export class YandexDiskController {
  constructor(private readonly yandexDiskService: YandexDiskService) {}

  @Get("file/:path")
  async getFile(
    @Param("path") path: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const fileStream = await this.yandexDiskService.getFile(path);

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

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async createFile(@UploadedFile() file: Express.Multer.File) {
   
    return this.yandexDiskService.uploadFile(file);
  }
  
  @Post("upload-multiple")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor("files"))
  async createFileMultyple(@UploadedFiles() file: Express.Multer.File[]) {
    return this.yandexDiskService.uploadMultipleFiles(file);
  }
}
