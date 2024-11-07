import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookId: string;
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
