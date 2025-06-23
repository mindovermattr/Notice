import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, MinDate } from "class-validator";
import { Role } from "src/enums/roles";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  role?: Role;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  due_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  createdAt?: Date;
}
