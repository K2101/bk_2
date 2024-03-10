import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { BookingModule } from './modules/booking/booking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { credentials } from './config/credential';
import { UserEntity } from './entities/user-entity';
import { BookingEntity } from './entities/booking-entity';


@Module({
  imports: [UserModule, BookingModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        url: credentials.db,
        ssl: true,
        type: 'postgres',
        autoLoadEntities: true,

        // For dev only, must be false in production and use migration instead.
        synchronize: true,
        entities: [UserEntity, BookingEntity],
      }),
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule { }
