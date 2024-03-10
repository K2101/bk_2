import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './book.service';
import { BookingEntity } from 'src/entities/booking-entity';
import { UserEntity } from 'src/entities/user-entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BookingEntity])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule { }
