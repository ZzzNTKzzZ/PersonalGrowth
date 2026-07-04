import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Gender, Theme } from "../../../generated/prisma/enums.js";

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  fullName?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  timezone?: string;

  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  confirmPassword!: string;
}
