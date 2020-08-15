/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import Category from './ticket/Category';
import Ticket from './ticket/Ticket';

@Entity()
@ObjectType()
class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public type!: string;

  @Field()
  @Column()
  public url!: String;

  @ManyToOne(() => Ticket, (Ticket) => Ticket.files)
  @Field(() => Ticket)
  public ticket!: Ticket;

  @OneToMany(() => Category, (Category) => Category.file)
  public categories!: Category[];
}

export default File;
