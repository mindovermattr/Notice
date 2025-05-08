import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MinDate,
  MinLength,
  ValidateIf,
} from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(8)
  @Transform(({ value }) => value.trim())
  description: string;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  dueDate: Date;

  @ValidateIf((dto) => dto.priority !== undefined)
  @IsBoolean()
  priority?: boolean;

  @IsString()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
