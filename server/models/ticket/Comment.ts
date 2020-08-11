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
  @Field((type) => ID)
  public id!: number;

  @ManyToOne((type) => Analyst)
  @Field((type) => Analyst)
  public user!: Analyst;

  @Column()
  @Field()
  public content!: string;

  @Column()
  @Field()
  public date: Date = new Date();

  @ManyToOne((type) => Ticket, (Ticket) => Ticket.comments)
  @Field((type) => Ticket)
  public ticket!: Ticket;
}

export default Comment;
