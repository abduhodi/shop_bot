import { IsNumber, IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  isBot: boolean;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;

  @IsString()
  phoneNumber: string;
}
