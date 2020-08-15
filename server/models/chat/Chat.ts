/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import Analyst from '../Analyst';
import Message from './Message';

@Entity()
@ObjectType()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @ManyToMany(() => Analyst, (Analyst) => Analyst.chats)
  @Field(() => [Analyst])
  @JoinTable()
  public participants!: Analyst[];

  @OneToMany(() => Message, (Message) => Message.chat)
  @Field(() => [Message])
  public messages!: Message[];
}

export default Chat;
