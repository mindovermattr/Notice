import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  patch(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.patchUser(+req.user.id, updateUserDto);
  }

  @Patch("avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  patchAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.userService.patchUserAvatar(+req.user.id, file);
  }
}
