import { IsDateString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNotEmpty()
  @Length(10, 10)
  phone: string;
}
