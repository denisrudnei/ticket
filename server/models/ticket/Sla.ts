import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Category from './Category'

@Entity()
@ObjectType()
class Sla extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column()
  @Field()
  public limit: Date = new Date()

  @OneToMany(type => Category, Category => Category.sla)
  @Field(type => [Category])
  public categories!: Category[]
}

export default Sla
