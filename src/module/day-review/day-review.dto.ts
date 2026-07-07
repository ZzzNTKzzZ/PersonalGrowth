import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateDayReviewDto {
  @IsInt()
  @Min(1)
  @Max(10)
  productivity!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  moodScore!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  healthScore!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  satisfaction!: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;

  @IsDateString()
  reviewDate!: string;
}

export class UpdateDayReviewDto {
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  productivity?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  moodScore?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  healthScore?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  satisfaction?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
