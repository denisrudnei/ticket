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
  @Field((type) => ID)
  public id!: number;

  @ManyToMany((type) => Analyst, (Analyst) => Analyst.chats)
  @Field((type) => [Analyst])
  @JoinTable()
  public participants!: Analyst[];

  @OneToMany((type) => Message, (Message) => Message.chat)
  @Field((type) => [Message])
  public messages!: Message[];
}

export default Chat;
