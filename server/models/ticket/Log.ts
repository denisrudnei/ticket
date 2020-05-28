import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import Analyst from '../Analyst'
import Group from './Group'
import Status from './Status'
import Ticket from './Ticket'

@Entity()
@ObjectType()
class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @ManyToOne(type => Analyst)
  @JoinColumn({ name: 'user' })
  @Field(type => Analyst)
  public user!: Analyst

  @Column()
  @Field()
  public date: Date = new Date()

  @ManyToOne(type => Status)
  @JoinColumn({ name: 'oldStatus' })
  @Field(type => Status)
  public oldStatus!: Status

  @ManyToOne(type => Status)
  @JoinColumn({ name: 'newStatus' })
  @Field(type => Status)
  public newStatus!: Status

  @ManyToOne(type => Group)
  @JoinColumn({ name: 'group' })
  @Field(type => Group)
  public group!: Group

  @ManyToOne(type => Ticket, Ticket => Ticket.logs)
  @Field(type => Ticket)
  public ticket!: Ticket
}

export default Log
