import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { MoodLevel } from "../../../generated/prisma/enums.js";

export class CreateMoodDto {
  @IsEnum(MoodLevel)
  level!: MoodLevel;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  reason?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}

export class UpdateMoodDto {
  @IsEnum(MoodLevel)
  @IsOptional()
  level?: MoodLevel;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  reason?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
