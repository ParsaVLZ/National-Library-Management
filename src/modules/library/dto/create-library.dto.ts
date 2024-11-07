import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateLibraryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  libraryName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerFirstName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerLastName: string;
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}
