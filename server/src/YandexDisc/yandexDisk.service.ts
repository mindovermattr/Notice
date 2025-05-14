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
    let isAlreadyUpploaded = false;
    try {
      const checkResponse = await firstValueFrom(
        this.httpService.head(
          `https://${this.apiUrl}/${encodeURIComponent(file.originalname)}`,
          {
            headers: {
              Authorization: `OAuth ${this.configService.get("OAUTH_TOKEN")}`,
            },
          },
        ),
      );

      if (checkResponse.status === 200) {
        isAlreadyUpploaded = true;
        //throw new HttpException("File already exists", 409);
      }
    } catch (e) {
      if (!axios.isAxiosError(e) || e.response?.status !== 404) {
        if (axios.isAxiosError(e)) {
          throw new HttpException(e.message, e.response?.status || 500);
        }
        throw e;
      }
    }

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
        fileName: file.originalname,
        imageSrc: `http://localhost:3001/api/yandex-disk/file/${encodeURIComponent(file.originalname)}`,
        status: response.status,
        isAlreadyUpploaded,
      };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new HttpException(e.message, e.status);
      }
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
  ): Promise<
    {
      imageSrc: string;
      status: number;
      fileName: string;
      isAlreadyUpploaded: boolean;
    }[]
  > {
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
