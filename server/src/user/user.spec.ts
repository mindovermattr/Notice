import { HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

describe("UserService", () => {
  let userService: UserService;
  let mockPrismaService: any;
  let mockYandexDiskService: any;

  beforeEach(() => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    mockYandexDiskService = {
      uploadFile: jest.fn(),
    };

    userService = new UserService(
      mockPrismaService as any,
      mockYandexDiskService as any,
    );

    // Мокируем bcrypt.hash
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementation(() => Promise.resolve("hashedPassword"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
        name: "Test",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.jpg",
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        name: createUserDto.name,
        lastname: createUserDto.lastname,
        avatarUrl: createUserDto.avatarUrl,
      });

      const result = await userService.create(createUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
      expect(result).toEqual({
        id: 1,
        email: "test@example.com",
        name: "Test",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.jpg",
      });
    });

    it("should throw an error if user already exists", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
        name: "Test",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.jpg",
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
      });

      await expect(userService.create(createUserDto)).rejects.toThrow(
        new HttpException("Пользователь уже создан", HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe("findOne", () => {
    it("should return a user by email", async () => {
      const email = "test@example.com";
      const mockUser = {
        id: 1,
        email,
        name: "Test",
        lastname: "User",
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await userService.findOne(email);

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("patchUser", () => {
    it("should update user data", async () => {
      const id = 1;
      const updateDto: UpdateUserDto = {
        name: "Updated",
        lastname: "User",
      };

      const updatedUser = {
        id,
        email: "test@example.com",
        ...updateDto,
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await userService.patchUser(id, updateDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe("patchUserAvatar", () => {
    it("should update user avatar", async () => {
      const id = 1;
      const file = {
        mimetype: "image/jpeg",
        originalname: "avatar.jpg",
        buffer: Buffer.from("test"),
      } as Express.Multer.File;
      const imageSrc = "http://localhost:3001/api/yandex-disk/file/hash.jpg";

      mockYandexDiskService.uploadFile.mockResolvedValue({
        status: 200,
        imageSrc,
        fileName: "avatar.jpg",
        isAlreadyUpploaded: false,
      });

      mockPrismaService.user.update.mockResolvedValue({
        id,
        avatarUrl: imageSrc,
      });

      const result = await userService.patchUserAvatar(id, file);

      expect(mockYandexDiskService.uploadFile).toHaveBeenCalledWith(file);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: { avatarUrl: imageSrc },
      });
      expect(result).toEqual({
        id,
        avatarUrl: imageSrc,
      });
    });

    it("should throw an error for non-jpeg files", async () => {
      const id = 1;
      const file = {
        mimetype: "image/png",
      } as Express.Multer.File;

      await expect(userService.patchUserAvatar(id, file)).rejects.toThrow(
        new HttpException(
          "Поддерживаются только jpg картинки",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it("should throw an error if upload fails", async () => {
      const id = 1;
      const file = {
        mimetype: "image/jpeg",
        originalname: "avatar.jpg",
        buffer: Buffer.from("test"),
      } as Express.Multer.File;

      mockYandexDiskService.uploadFile.mockResolvedValue({
        status: 400,
        imageSrc: "",
        fileName: "avatar.jpg",
        isAlreadyUpploaded: false,
      });

      await expect(userService.patchUserAvatar(id, file)).rejects.toThrow(
        new HttpException("Ошибка", HttpStatus.BAD_REQUEST),
      );
    });
  });
});
