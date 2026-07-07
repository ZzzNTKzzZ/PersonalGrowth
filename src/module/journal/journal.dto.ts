import { IsOptional, IsString, MaxLength, MinLength, IsUrl } from "class-validator";

export class CreateJournalDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @MinLength(2)
  content!: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateJournalDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  content?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
