import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    return user;
  }

  async login(reqUser: User) {
    
    const user = await this.prismaService.user.findFirst({
      where: {
        id: reqUser.id,
      },
    });

    return {
      user,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
