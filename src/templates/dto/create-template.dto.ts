import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EventEntity } from '../../events/entities/event.entity';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  event: EventEntity;
}
