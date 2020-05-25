import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Ticket from './ticket/Ticket'

@Entity()
@ObjectType()
class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column()
  @Field()
  public country!: string

  @Column()
  @Field()
  public street!: string

  @Column()
  @Field()
  public cep!: string

  @Column()
  @Field()
  public city!: string

  @Column()
  @Field()
  public state!: string
}

export default Address
