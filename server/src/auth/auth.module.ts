import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "src/prisma.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { YandexDiskModule } from "src/YandexDisc/yandexDisk.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategies";
import { LocalStrategy } from "./strategies/local.strategies";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: { expiresIn: "30d" },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    YandexDiskModule,
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    PrismaService,
    ConfigService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
