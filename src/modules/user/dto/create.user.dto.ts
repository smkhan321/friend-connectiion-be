import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { image } from '../../../constants/constants';

export class CreateUserDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  fcm_token?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsFile()
  @MaxFileSize(image.size)
  @HasMimeType(image.types)
  @IsOptional()
  image?: MemoryStoredFile;
}
