import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  restaurantId: string;
}
