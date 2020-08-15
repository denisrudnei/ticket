/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import Category from '../ticket/Category';
import Group from '../ticket/Group';
import KnowledgeFile from './KnowledgeFile';
import KnowledgeStatus from './KnowledgeStatus';

@Entity()
@ObjectType()
class Knowledge extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  @Field(() => String)
  public name!: string;

  @Column({ nullable: true })
  public key!: string;

  @Column()
  @Field(() => Date)
  public created: Date = new Date();

  @ManyToOne(() => Category)
  @Field(() => Category)
  public category!: Category;

  @ManyToOne(() => Group)
  @Field(() => Group)
  public group!: Group;

  @ManyToOne(() => KnowledgeStatus)
  @Field(() => KnowledgeStatus)
  public status!: KnowledgeStatus;

  @Column()
  @Field(() => String)
  public url: string = '';

  @Field(() => String)
  public get preview(): string {
    return this.description.substring(0, 100);
  }

  @Column()
  @Field(() => String)
  public description!: string;

  @Field(() => [KnowledgeFile])
  @OneToMany(
    () => KnowledgeFile,
    (KnowledgeFile) => KnowledgeFile.knowledge,
  )
  public files!: KnowledgeFile[];
}

export default Knowledge;
