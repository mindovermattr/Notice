import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOne(email);
    if (user?.password !== pass) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { password, ...result } = user;
  
    return result;
  }

  async login(user: User) {
    const user1 = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    return {
      user,
      token: this.jwtService.sign(user1),
    };
  }
}
