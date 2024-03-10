import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { BookingService } from './book.service';
import { BookingDto } from './dto/booking-dto';
import { AuthGuard } from 'src/guards/auth.guard';


@UseGuards(new AuthGuard())
@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }


  @Post('/book')
  async book(
    @Body(ValidationPipe) bookingDto: BookingDto,
    @Req() req: Request
  ): Promise<string> {
    return await this.bookingService.book(bookingDto, req);
  }

  @Get('/book')
  async getAllBooked() {
    return await this.bookingService.getAllBooked();
  }
}
