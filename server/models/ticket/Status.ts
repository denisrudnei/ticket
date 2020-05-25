import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Ticket from './Ticket'

@Entity()
@ObjectType()
class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column({ nullable: true })
  @Field()
  public description!: string

  @ManyToMany(type => Status)
  @JoinTable()
  @Field(type => [Status])
  public allowedStatus!: Status[]

  @Column()
  @Field()
  public slaRun: boolean = false

  @OneToMany(type => Ticket, status => status)
  @Field(type => [Ticket])
  public tickets!: Ticket[]
}

export default Status
