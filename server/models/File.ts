import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import Ticket from './ticket/Ticket'

@Entity()
@ObjectType()
class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column()
  @Field()
  public type!: string

  @Field()
  @Column()
  public url!: String

  @ManyToOne(type => Ticket, Ticket => Ticket.files)
  @Field(type => Ticket)
  public ticket!: Ticket
}

export default File
