/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import Ticket from './Ticket';

@Entity()
@ObjectType()
class Priority extends BaseEntity {
  constructor(priority?: Partial<Priority>) {
    super();
    Object.assign(this, priority);
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public weight!: number;

  @Column()
  @Field()
  public name!: string;

  @OneToMany(() => Ticket, (Ticket) => Ticket.priority)
  @Field(() => [Ticket])
  public tickets!: Ticket[];
}

export default Priority;
