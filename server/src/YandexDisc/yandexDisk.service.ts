import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { firstValueFrom } from "rxjs";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@Injectable()
export class YandexDiskService {
  private readonly apiUrl = "webdav.yandex.ru";

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
  async uploadFile(path: string) {
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
}
