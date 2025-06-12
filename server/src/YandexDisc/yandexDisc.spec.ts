import { HttpService } from "@nestjs/axios";
import { HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";
import { YandexDiskService } from "./yandexDisk.service";

describe("YandexDiskService", () => {
  let service: YandexDiskService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YandexDiskService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            put: jest.fn(),
            head: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("test-token"),
          },
        },
      ],
    }).compile();

    service = module.get<YandexDiskService>(YandexDiskService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  describe("generateHashFilename", () => {
    it("should generate a hash filename with extension", () => {
      const buffer = Buffer.from("test");
      const originalname = "image.jpg";
      const result = service.generateHashFilename(buffer, originalname);

      expect(result).toMatch(/^[a-f0-9]{64}\.jpg$/);
    });
  });

  describe("getFile", () => {
    it("should return file buffer", async () => {
      const mockBuffer = Buffer.from("test");
      httpService.get.mockReturnValue(
        of({ data: mockBuffer, status: 200, statusText: "OK" } as any),
      );

      const result = await service.getFile("test.jpg");
      expect(result).toEqual(mockBuffer);
      expect(httpService.get).toHaveBeenCalledWith(
        "https://webdav.yandex.ru/imgs/test.jpg",
        {
          headers: { Authorization: "OAuth test-token" },
          responseType: "arraybuffer",
        },
      );
    });

    it("should throw HttpException on axios error", async () => {
      const error = {
        isAxiosError: true,
        message: "Not Found",
        status: 404,
      };
      httpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getFile("notfound.jpg")).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe("uploadFile", () => {
    const mockFile = {
      originalname: "test.jpg",
      buffer: Buffer.from("test"),
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    it("should upload new file", async () => {
      // 1. Мокируем проверку существования файла (возвращаем 404)
      httpService.head.mockReturnValue(
        throwError(() => ({
          response: {
            status: 404,
            statusText: "Not Found",
          },
          isAxiosError: true,
        })),
      );

      // 2. Мокируем успешную загрузку
      httpService.put.mockReturnValue(
        of({
          status: 201,
          statusText: "Created",
          data: {},
        } as any),
      );

      const result = await service.uploadFile(mockFile);

      expect(result.status).toBe(201);
      expect(result.isAlreadyUpploaded).toBe(false);
      expect(httpService.head).toHaveBeenCalled();
      expect(httpService.put).toHaveBeenCalled();
    });

    it("should throw HttpException on upload error", async () => {
      httpService.head.mockReturnValue(
        throwError(() => ({
          response: {
            status: 404,
            statusText: "Not Found",
          },
          isAxiosError: true,
        })),
      );

      httpService.put.mockReturnValue(
        throwError(() => ({
          isAxiosError: true,
          message: "Server Error",
          response: {
            status: 500,
          },
        })),
      );

      await expect(service.uploadFile(mockFile)).rejects.toThrow(HttpException);
    });
  });

  describe("uploadMultipleFiles", () => {
    it("should upload multiple files", async () => {
      const mockFiles = [
        {
          originalname: "test1.jpg",
          buffer: Buffer.from("test1"),
          mimetype: "image/jpeg",
        },
        {
          originalname: "test2.jpg",
          buffer: Buffer.from("test2"),
          mimetype: "image/jpeg",
        },
      ] as Express.Multer.File[];

      jest.spyOn(service, "uploadFile").mockImplementation((file) =>
        Promise.resolve({
          fileName: file.originalname,
          imageSrc: `http://localhost:3001/api/yandex-disk/file/${file.originalname}`,
          status: 200,
          isAlreadyUpploaded: false,
        }),
      );

      const results = await service.uploadMultipleFiles(mockFiles);

      expect(results).toHaveLength(2);
      expect(results[0].fileName).toBe("test1.jpg");
      expect(results[1].fileName).toBe("test2.jpg");
    });

    it("should handle errors in multiple uploads", async () => {
      const mockFiles = [
        {
          originalname: "good.jpg",
          buffer: Buffer.from("good"),
          mimetype: "image/jpeg",
        },
        {
          originalname: "bad.jpg",
          buffer: Buffer.from("bad"),
          mimetype: "image/jpeg",
        },
      ] as Express.Multer.File[];

      jest
        .spyOn(service, "uploadFile")
        .mockImplementationOnce(() =>
          Promise.resolve({
            fileName: "good.jpg",
            imageSrc: "http://localhost:3001/api/yandex-disk/file/good.jpg",
            status: 200,
            isAlreadyUpploaded: false,
          }),
        )
        .mockImplementationOnce(() =>
          Promise.reject(new HttpException("Error", 500)),
        );

      const results = await service.uploadMultipleFiles(mockFiles);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe(200);
      expect(results[1].status).toBe(500);
    });
  });
});
