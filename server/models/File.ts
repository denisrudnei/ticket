import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
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
  public data!: String

  @ManyToOne(type => Ticket, Ticket => Ticket.files)
  @Field(type => Ticket)
  public ticket!: Ticket
}

export default File
