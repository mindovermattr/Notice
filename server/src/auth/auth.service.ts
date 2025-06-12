import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user)
      throw new HttpException(
        "Почта не зарегистрирована",
        HttpStatus.NOT_FOUND,
      );

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpException("Пароль не верен", HttpStatus.BAD_REQUEST);

    return user;
  }

  async login(reqUser: User) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: reqUser.id,
      },
      omit: {
        password: true,
      },
    });

    return {
      user,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }

  async registration(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { user, token };
  }
}
