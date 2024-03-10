// import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { UserEntity } from "./user-entity";

// @Entity()
// export class BookingEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   @Index()
//   startDate: Date;

//   @Column()
//   @Index()
//   endDate: Date;

//   @CreateDateColumn({ readonly: true })
//   createdAt: Date;

//   @UpdateDateColumn()
//   updateAt: Date;


//   // @ManyToOne(() => UserEntity, (user) => user.bookings)
//   // user: UserEntity;

// }

import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user-entity";

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  startDate: number;

  @Column()
  @Index()
  endDate: number;

  @Column()
  @Index()
  startMonth: number;

  @Column()
  @Index()
  endMonth: number;

  @Column()
  @Index()
  startYear: number;

  @Column()
  @Index()
  endYear: number;


  @CreateDateColumn({ readonly: true })
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user: UserEntity;

}