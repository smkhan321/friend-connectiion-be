import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { image } from '../../../constants/constants';

export class UpdateUserDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsFile()
  @MaxFileSize(image.size)
  @HasMimeType(image.types)
  @IsOptional()
  image?: MemoryStoredFile;
}
