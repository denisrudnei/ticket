/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Category from './Category';

@Entity()
@ObjectType()
class CategoryField extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public required: boolean = false;

  @Column()
  @Field()
  public text!: string;

  @Column()
  @Field()
  public min!: number;

  @Column()
  @Field()
  public max!: number;

  @ManyToOne(() => Category, (Category) => Category.fields)
  @Field(() => Category)
  public category!: Category;
}

export default CategoryField;
