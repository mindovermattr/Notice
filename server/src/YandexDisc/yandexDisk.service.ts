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
  async uploadFile(file: Express.Multer.File, name: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `https://${this.apiUrl}/${name}`,
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
        imageSrc: `http://localhost:3001/api/yandex-disk/file/${name}`,
        status: response.status,
      };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new HttpException(e.message, e.status);
      }
      console.log(e);
    }
  }
}
