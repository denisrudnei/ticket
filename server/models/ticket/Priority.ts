import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Ticket from './Ticket'

@Entity()
@ObjectType()
class Priority extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public weight!: number

  @Column()
  @Field()
  public name!: string

  @OneToMany(type => Ticket, Ticket => Ticket.priority)
  @Field(type => [Ticket])
  public tickets!: Ticket[]
}

export default Priority
