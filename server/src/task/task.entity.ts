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

  @Column({ type: "boolean", default: false })
  status: boolean;

  @Column({ type: "boolean", default: false })
  updated: boolean;

  @Column()
  username: string;

  @Column()
  email: string;
}
