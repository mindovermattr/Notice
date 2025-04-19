import { IsString } from "class-validator";

export class CreateTasklistDto {
  @IsString()
  title: string;
}
