import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { YandexDiskService } from "src/YandexDisc/yandexDisk.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly yandexDiskService: YandexDiskService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user)
      throw new HttpException("User already exist", HttpStatus.BAD_REQUEST);

    const hashPassword = await bcrypt.hash(createUserDto.password, 12);
    const data = {
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      lastname: createUserDto.lastname,
      avatarUrl: createUserDto.avatarUrl,
    };

    const createdUser = await this.prismaService.user.create({
      data,
      omit: {
        password: true,
      },
    });
    return createdUser;
  }

  async findOne(email: string) {
    const data = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    return data;
  }

  async patchUser(id: number, updateDto: UpdateUserDto) {
    const data = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateDto,
      },
    });
    return data;
  }

  async patchUserAvatar(id: number, file: Express.Multer.File) {
    if (file.mimetype !== "image/jpeg")
      throw new HttpException(
        "Поддерживаются только jpg картинки",
        HttpStatus.BAD_REQUEST,
      );

    const resp = await this.yandexDiskService.uploadFile(file);
    if (resp.status >= 300)
      throw new HttpException("Ошибка", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        avatarUrl: resp.imageSrc,
      },
    });
    return data;
  }
}
