/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import Category from './Category';

@Entity()
@ObjectType()
class Sla extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public limit: Date = new Date();

  @OneToMany((type) => Category, (Category) => Category.sla)
  @Field((type) => [Category])
  public categories!: Category[];
}

export default Sla;
