import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  @IsOptional()
  color!: string

  @IsString()
  @IsOptional()
  icon!: string
}


export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name!: string

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  @IsOptional()
  color!: string

  @IsString()
  @IsOptional()
  icon!: string
}

