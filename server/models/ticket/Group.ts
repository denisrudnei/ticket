/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import Analyst from '../Analyst';

@Entity()
@ObjectType()
class Group extends BaseEntity {
  constructor(group?: Partial<Group>) {
    super();
    Object.assign(this, group);
  }

  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true })
  @Field()
  public description!: string;

  @ManyToMany((type) => Analyst, (Analyst) => Analyst.groups)
  @JoinTable()
  @Field((type) => [Analyst])
  public analysts!: Analyst[];
}

export default Group;
