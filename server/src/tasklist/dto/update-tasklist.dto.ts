import { PartialType } from '@nestjs/mapped-types';
import { CreateTasklistDto } from './create-tasklist.dto';

export class UpdateTasklistDto extends PartialType(CreateTasklistDto) {}
