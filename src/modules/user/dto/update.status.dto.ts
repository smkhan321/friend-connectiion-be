import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { image } from '../../../constants/constants';

export class UpdateStatusDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  status: string;
}
