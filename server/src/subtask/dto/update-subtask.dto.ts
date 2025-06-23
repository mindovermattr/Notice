import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateSubtaskDto } from "./create-subtask.dto";

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
