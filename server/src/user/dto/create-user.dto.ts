import { IsEmail, IsOptional, IsString } from "class-validator";
import { IsMatch } from "src/decorators/IsMatch";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsMatch("password")
  confirmPassword: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
