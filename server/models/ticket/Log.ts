/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Analyst from '../Analyst';
import Group from './Group';
import Status from './Status';
import Ticket from './Ticket';

@Entity()
@ObjectType()
class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @ManyToOne(() => Analyst)
  @JoinColumn({ name: 'user' })
  @Field(() => Analyst)
  public user!: Analyst;

  @Column()
  @Field()
  public date: Date = new Date();

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'oldStatus' })
  @Field(() => Status)
  public oldStatus!: Status;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'newStatus' })
  @Field(() => Status)
  public newStatus!: Status;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group' })
  @Field(() => Group)
  public group!: Group;

  @ManyToOne(() => Ticket, (Ticket) => Ticket.logs)
  @JoinColumn()
  @Field(() => Ticket)
  public ticket!: Ticket;
}

export default Log;
