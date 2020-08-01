/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import CategoryField from './CategoryField';
import Group from './Group';
import Priority from './Priority';
import Sla from './Sla';
import Status from './Status';

@Entity()
@ObjectType()
class Category extends BaseEntity {
  constructor(category?: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  public id!: number;

  @Column()
  @Field((type) => String)
  public name!: string;

  @OneToMany((type) => Category, (Category) => Category.subs)
  @Field((type) => [Category])
  public father!: Category;

  @Column()
  @Field()
  public description!: string;

  @ManyToMany((type) => Category, (Category) => Category.father)
  @JoinTable()
  @Field((type) => [Category])
  public subs!: Category[];

  @ManyToOne((type) => Group, { nullable: false, eager: true })
  @Field((type) => Group)
  @JoinColumn({ name: 'defaultGroup' })
  public defaultGroup!: Group;

  @ManyToOne((type) => Status, { nullable: false, eager: true })
  @Field((type) => Status)
  @JoinColumn({ name: 'defaultStatus' })
  public defaultStatus!: Status;

  @ManyToOne((type) => Priority, { nullable: false, eager: true })
  @Field((type) => Priority)
  @JoinColumn({ name: 'defaultPriority' })
  public defaultPriority!: Priority;

  @OneToMany((type) => CategoryField, (CategoryField) => CategoryField.category)
  @JoinColumn({ name: 'fields' })
  @Field((type) => [CategoryField])
  public fields!: CategoryField[];

  @ManyToOne((type) => Sla, (Sla) => Sla.categories, {
    nullable: false,
    eager: true,
  })
  @Field((type) => Sla)
  public sla!: Sla;

  @Field()
  public get fullName(): string {
    if (!this.father) return this.name;
    return `${this.father.fullName}.${this.name}`;
  }
}

export default Category;
