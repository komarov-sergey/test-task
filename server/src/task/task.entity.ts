import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

import { User } from "../user/user.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  status: string;

  @Column()
  username: string;

  @Column()
  email: string;

  // @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  // author: User;
}
