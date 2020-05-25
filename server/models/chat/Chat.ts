import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Analyst from '../Analyst'
import Message from './Message'

@Entity()
@ObjectType()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @ManyToMany(type => Analyst, Analyst => Analyst.chats)
  @Field(type => [Analyst])
  public participants!: Analyst[]

  @OneToMany(type => Message, Message => Message.chat)
  @Field(type => [Message])
  public messages!: Message[]
}

export default Chat
