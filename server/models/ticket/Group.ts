import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from 'typeorm'

import { ObjectType, Field, ID } from 'type-graphql'
import Analyst from '../Analyst'

@Entity()
@ObjectType()
class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column({ nullable: true })
  @Field()
  public description!: string

  @ManyToMany(type => Analyst, Analyst => Analyst.groups)
  @JoinTable()
  @Field(type => [Analyst])
  public analysts!: Analyst[]
}

export default Group
