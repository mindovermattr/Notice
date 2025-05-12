import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class YandexDiskService {
  private readonly apiUrl = "webdav.yandex.ru/imgs";

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getFile(path: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://${this.apiUrl}/${path}`, {
          headers: {
            Authorization: `OAuth ${this.configService.get("OAUTH_TOKEN")}`,
          },
          responseType: "arraybuffer",
        }),
      );
      return Buffer.from(response.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new HttpException(e.message, e.status);
      }
    }
  }
  async uploadFile(file: Express.Multer.File) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `https://${this.apiUrl}/${encodeURIComponent(file.originalname)}`,
          Buffer.from(file.buffer),
          {
            headers: {
              Authorization: `OAuth ${this.configService.get("OAUTH_TOKEN")}`,
              "Content-Type": file.mimetype,
            },
          },
        ),
      );
      return {
        imageSrc: `http://localhost:3001/api/yandex-disk/file/${encodeURIComponent(file.originalname)}`,
        status: response.status,
      };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new HttpException(e.message, e.status);
      }
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
  ): Promise<{ imageSrc: string; status: number }[]> {
    const results = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file);
        results.push(result);
      } catch (error) {
        results.push({
          filename: file.originalname,
          error: error.message,
          status: error.status || 500,
        });
      }
    }

    return results;
  }
}
