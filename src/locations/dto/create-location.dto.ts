import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @IsNumber()
  @Min(-90, { message: 'Latitude must be greater than or equal to -90' })
  @Max(90, { message: 'Latitude must be less than or equal to 90' })
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Min(-180, { message: 'Longitude must be greater than or equal to -180' })
  @Max(180, { message: 'Longitude must be less than or equal to 180' })
  @Type(() => Number)
  longitude: number;
}
