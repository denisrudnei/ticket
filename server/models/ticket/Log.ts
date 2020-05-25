import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Column,
  ManyToMany,
  ManyToOne
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Analyst from '../Analyst'
import Status from './Status'
import Group from './Group'
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
