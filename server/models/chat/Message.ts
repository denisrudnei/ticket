/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Analyst from '../Analyst';
import Chat from './Chat';

@Entity()
@ObjectType()
class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  public id!: number;

  @ManyToOne((type) => Chat, (Chat) => Chat.messages)
  @JoinColumn({ name: 'chat' })
  public chat!: Chat;

  @ManyToOne((type) => Analyst)
  @Field((type) => Analyst)
  public to!: Analyst;

  @ManyToOne((type) => Analyst)
  @JoinColumn({ name: 'from' })
  @Field((type) => Analyst)
  public from!: Analyst;

  @Column()
  @Field()
  public content!: string;

  @ManyToMany((type) => Analyst)
  @JoinTable()
  @Field((type) => [Analyst])
  public read!: Analyst[];

  @Column()
  @Field()
  public date: Date = new Date();
}

export default Message;
