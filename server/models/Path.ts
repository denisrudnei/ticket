import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Analyst from './Analyst';

@Entity()
@ObjectType()
export class Path extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public objectName!: string;

  @Column()
  @Field()
  public property!: string;

  @Column()
  @Field()
  public name!: string;

  @ManyToOne(() => Analyst)
  @Field(() => Analyst)
  public user!: Analyst;
}

export default Path;
