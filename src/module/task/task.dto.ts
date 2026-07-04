import { IsDate, IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TaskStatus } from "../../../generated/prisma/enums.js";


export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string

  @IsString()
  @IsOptional()
  description!: string

  @IsDateString()
  @IsOptional()
  dueDate!: string

  @IsString()
  @IsOptional()
  categoryId!: string
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  categoryId?: string | null;
}