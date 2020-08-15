/* eslint-disable no-shadow */
import File from '@/server/models/File';
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
  OneToOne,
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
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field(() => String)
  public name!: string;

  @OneToMany(() => Category, (Category) => Category.subs)
  @Field(() => [Category], { nullable: true })
  public father!: Category;

  @Column()
  @Field()
  public description!: string;

  @ManyToMany(() => Category, (Category) => Category.father)
  @JoinTable()
  @Field(() => [Category])
  public subs!: Category[];

  @ManyToOne(() => Group, { nullable: false, eager: true })
  @Field(() => Group)
  @JoinColumn({ name: 'defaultGroup' })
  public defaultGroup!: Group;

  @ManyToOne(() => Status, { nullable: false, eager: true })
  @Field(() => Status)
  @JoinColumn({ name: 'defaultStatus' })
  public defaultStatus!: Status;

  @ManyToOne(() => Priority, { nullable: false, eager: true })
  @Field(() => Priority)
  @JoinColumn({ name: 'defaultPriority' })
  public defaultPriority!: Priority;

  @OneToMany(() => CategoryField, (CategoryField) => CategoryField.category, { cascade: true })
  @JoinColumn({ name: 'fields' })
  @Field(() => [CategoryField])
  public fields!: CategoryField[];

  @ManyToOne(() => Sla, (Sla) => Sla.categories, {
    nullable: false,
    eager: true,
  })
  @Field(() => Sla)
  public sla!: Sla;

  @Field(() => File, { nullable: true })
  @JoinColumn({ name: 'file' })
  @OneToOne(() => File)
  public file?: File;

  @Field()
  public get fullName(): string {
    if (!this.father) return this.name;
    return `${this.father.fullName}.${this.name}`;
  }
}

export default Category;
