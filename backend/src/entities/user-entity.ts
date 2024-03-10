import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm'
import { BookingEntity } from './booking-entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ readonly: true })
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];

}
