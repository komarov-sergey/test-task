import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

import {Task} from '../task/task.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({type: 'boolean', default: false})
  isSessionOpen: boolean
}
