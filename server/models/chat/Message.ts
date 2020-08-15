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
  @Field(() => ID)
  public id!: number;

  @ManyToOne(() => Chat, (Chat) => Chat.messages)
  @JoinColumn({ name: 'chat' })
  public chat!: Chat;

  @ManyToOne(() => Analyst)
  @Field(() => Analyst)
  public to!: Analyst;

  @ManyToOne(() => Analyst)
  @JoinColumn({ name: 'from' })
  @Field(() => Analyst)
  public from!: Analyst;

  @Column()
  @Field()
  public content!: string;

  @ManyToMany(() => Analyst)
  @JoinTable()
  @Field(() => [Analyst])
  public read!: Analyst[];

  @Column()
  @Field()
  public date: Date = new Date();
}

export default Message;
