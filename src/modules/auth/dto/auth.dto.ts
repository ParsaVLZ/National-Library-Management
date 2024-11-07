import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  @IsNotEmpty()
  phone: string;
}

export class LibraryOwnerRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  @IsNotEmpty()
  phone: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  libraryName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;
}

export class UserLoginDto {
  @ApiProperty()
  @IsString() 
  @Length(3, 100)
  @IsNotEmpty()
  phone: string;
}

export class LibraryOwnerLoginDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  @IsNotEmpty()
  phone: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  code: string;
}
