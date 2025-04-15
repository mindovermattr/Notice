import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
    };
    return await this.prismaService.user.create({
      data,
    });
  }

  async findOne(email: string) {
    const data = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    return data;
  }
}
