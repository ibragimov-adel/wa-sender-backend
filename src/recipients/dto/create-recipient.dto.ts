import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRecipientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  secondName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  birthDate?: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  birthMonth?: number;

  @IsPhoneNumber()
  phone: string;
}
