/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Analyst from '../Analyst';
import Ticket from './Ticket';

@Entity()
@ObjectType()
class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @ManyToOne(() => Analyst)
  @Field(() => Analyst)
  public user!: Analyst;

  @Column()
  @Field()
  public content!: string;

  @Column()
  @Field()
  public date: Date = new Date();

  @ManyToOne(() => Ticket, (Ticket) => Ticket.comments)
  @Field(() => Ticket)
  public ticket!: Ticket;
}

export default Comment;
