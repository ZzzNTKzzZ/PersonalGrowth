import { IsEnum, IsString, MaxLength, MinLength, IsOptional, IsDateString } from "class-validator";
import { HabitFrequency } from "../../../generated/prisma/enums.js";

export class CreateHabitDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;
}

export class UpdateHabitDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsEnum(HabitFrequency)
  @IsOptional()
  frequency?: HabitFrequency;
}

export class CheckHabitDto {
  @IsDateString()
  @IsOptional()
  completedAt?: Date
}