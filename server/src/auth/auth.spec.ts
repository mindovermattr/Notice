import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: any;
  let jwtService: any;
  let prismaService: any;

  beforeEach(() => {
    userService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };
    prismaService = {
      user: {
        findFirst: jest.fn(),
      },
    };

    authService = new AuthService(userService, jwtService, prismaService);
  });

  describe("validateUser", () => {
    it("should throw if user not found", async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        authService.validateUser("test@example.com", "pass"),
      ).rejects.toThrow(
        new HttpException("Почта не зарегистрирована", HttpStatus.NOT_FOUND),
      );

      expect(userService.findOne).toHaveBeenCalledWith("test@example.com");
    });

    it("should throw if password does not match", async () => {
      const user = { email: "test@example.com", password: "hashedpassword" };
      userService.findOne.mockResolvedValue(user);

      jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(false)) as jest.Mock;

      await expect(
        authService.validateUser("test@example.com", "wrongpass"),
      ).rejects.toThrow(
        new HttpException("Пароль не верен", HttpStatus.BAD_REQUEST),
      );

      expect(userService.findOne).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", user.password);
    });

    it("should return user if password matches", async () => {
      const user = { email: "test@example.com", password: "hashedpassword" };
      userService.findOne.mockResolvedValue(user);

      jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(true)) as jest.Mock;

      const result = await authService.validateUser(
        "test@example.com",
        "correctpass",
      );

      expect(result).toEqual(user);
      expect(userService.findOne).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("correctpass", user.password);
    });
  });

  describe("login", () => {
    it("should return user data without password and token", async () => {
      const reqUser: User = {
        id: 1,
        email: "newuser@example.com",
        password: "pass",
        lastname: "test",
        name: "test",
        avatarUrl: "",
      };
      const user: User = {
        id: 1,
        email: "newuser@example.com",
        password: "pass",
        lastname: "test",
        name: "test",
        avatarUrl: "",
      };
      prismaService.user.findFirst.mockResolvedValue(user);
      jwtService.sign.mockReturnValue("jwt-token");

      const result = await authService.login(reqUser);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: reqUser.id },
        omit: { password: true },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(result).toEqual({ user, token: "jwt-token" });
    });
  });

  describe("registration", () => {
    it("should create user and return user data with token", async () => {
      const createUserDto: CreateUserDto = {
        email: "newuser@example.com",
        password: "pass",
        confirmPassword: "pass",
        lastname: "test",
        name: "test",
      };
      const user = { id: 1, email: createUserDto.email, name: "New User" };
      userService.create.mockResolvedValue(user);
      jwtService.sign.mockReturnValue("jwt-token");

      const result = await authService.registration(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(result).toEqual({ user, token: "jwt-token" });
    });
  });
});
