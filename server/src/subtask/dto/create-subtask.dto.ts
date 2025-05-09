import { IsString, MinLength } from "class-validator";

export class CreateSubtaskDto {
  @IsString()
  @MinLength(4, { message: "Минимальная длина - 4 символа" })
  title: string;
}
