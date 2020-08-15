/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Analyst from './Analyst';

@Entity()
@ObjectType()
class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @ManyToOne(() => Analyst, { eager: true })
  @Field(() => Analyst)
  public from!: Analyst;

  @ManyToMany(() => Analyst, (Analyst) => Analyst.notificationsToMe, {
    eager: true,
  })
  @JoinTable()
  @Field(() => [Analyst])
  public to!: Analyst[];

  @Column()
  @Field()
  public date: Date = new Date();

  @Column()
  @Field()
  public name!: string;

  @ManyToMany(() => Analyst, (Analyst) => Analyst.notificationsRead, {
    eager: true,
  })
  @JoinTable()
  @Field(() => [Analyst])
  public read!: Analyst[];

  @Column()
  @Field()
  public content!: string;

  @Column()
  @Field()
  public type!: string;

  public meta = '';
}

export default Notification;
