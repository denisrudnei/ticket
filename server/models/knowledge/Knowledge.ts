import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import Category from '../ticket/Category'
import Group from '../ticket/Group'
import KnowledgeFile from './KnowledgeFile'
import KnowledgeStatus from './KnowledgeStatus'

@Entity()
@ObjectType()
class Knowledge extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  @Field(type => String)
  public name!: string

  @Column({ nullable: true })
  public key!: string

  @Column()
  @Field(type => Date)
  public created: Date = new Date()

  @ManyToOne(type => Category)
  @Field(() => Category)
  public category!: Category

  @ManyToOne(type => Group)
  @Field(() => Group)
  public group!: Group

  @ManyToOne(type => KnowledgeStatus)
  @Field(type => KnowledgeStatus)
  public status!: KnowledgeStatus

  @Column()
  @Field(type => String)
  public url: string = ''

  @Column()
  @Field(type => String)
  public preview!: string

  @Field(type => [KnowledgeFile])
  @OneToMany(type => KnowledgeFile, KnowledgeFile => KnowledgeFile.knowledge)
  public files!: KnowledgeFile[]
}

export default Knowledge
