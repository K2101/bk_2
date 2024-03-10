import { BadRequestException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from 'src/entities/booking-entity';
import { UserEntity } from 'src/entities/user-entity';
import { Repository } from 'typeorm';
import { BookingDto } from './dto/booking-dto';
import { User } from 'src/guards/auth.guard';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingEntity: Repository<BookingEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) { }


  async book(bookingDto: BookingDto, request: Request): Promise<string> {
    const req = request as Request & { user: User };
    const user: User = req.user;


    const findUser = await this.userEntity.findOne({ where: { id: parseInt(user.userId) } })

    if (!user) {
      throw new UnauthorizedException('user does not exist');
    }

    const start = new Date(bookingDto.startDate);
    const end = new Date(bookingDto.endDate);

    const startDate = start.getDate();
    const endDate = end.getDate();

    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    if (endDate < startDate && endMonth < startMonth && endYear < startYear) {
      throw new BadRequestException("start date must less than end date")
    }

    const { email, name, phone } = bookingDto;

    try {
      await this.bookingEntity.manager.transaction('SERIALIZABLE', async (tsManager) => {
        const overlappingBookings = await tsManager.query(
          `SELECT COUNT(*) FROM "booking_entity" "b"
          WHERE (
            (b."startYear" < $1 OR (b."startYear" = $1 AND b."startMonth" < $2) 
            OR (b."startYear" = $1 AND b."startMonth" = $2 AND b."startDate" <= $3))
            AND
            (b."endYear" > $4 OR (b."endYear" = $4 AND b."endMonth" > $5) 
            OR (b."endYear" = $4 AND b."endMonth" = $5 AND b."endDate" >= $6))
          )`,
          [endYear, endMonth, endDate, startYear, startMonth, startDate]
        );

        if (overlappingBookings[0].count !== '0') {
          throw new Error();
        }

        const book = this.bookingEntity.create({
          startDate, endDate, startMonth, endMonth, startYear, endYear, email, name, phone, user: findUser
        });

        await tsManager.insert(BookingEntity, book);
      })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'the selected date was being booked' })
    }

    return JSON.stringify({ message: 'booking success' })
  }


  async getAllBooked(): Promise<BookingEntity[]> {
    return this.bookingEntity.find();
  }
}
