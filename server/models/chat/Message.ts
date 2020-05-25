import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable
} from 'typeorm'

import { ObjectType, Field, ID } from 'type-graphql'
import Analyst from '../Analyst'
import Chat from './Chat'

@Entity()
@ObjectType()
class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @ManyToOne(type => Chat, Chat => Chat.messages)
  @JoinColumn({ name: 'chat' })
  public chat!: Chat

  @ManyToOne(type => Analyst)
  @JoinColumn({ name: 'to' })
  @Field(type => Analyst)
  public to!: Analyst

  @ManyToOne(type => Analyst)
  @JoinColumn({ name: 'from' })
  @Field(type => Analyst)
  public from!: Analyst

  @Column()
  @Field()
  public content!: string

  @ManyToMany(type => Analyst)
  @JoinTable()
  @Field(type => [Analyst])
  public read!: Analyst[]

  @Column()
  @Field()
  public date: Date = new Date()
}

export default Message
