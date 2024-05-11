import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  dob!: Date;

  @Column()
  email!: string;

  @Column()
  address!: string;

  @Column()
  location!: string;

  @Column()
  timezone!: string;

  @Column({ nullable: true })
  lastBirthdayMessageSentAt!: Date;
}
