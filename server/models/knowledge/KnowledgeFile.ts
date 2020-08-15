/* eslint-disable no-shadow */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Knowledge from './Knowledge';

@Entity()
@ObjectType()
class KnowledgeFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field(() => String)
  public name!: string;

  @Column()
  @Field(() => String)
  public url: string = '';

  @ManyToOne(() => Knowledge, (Knowledge) => Knowledge.files)
  @Field(() => Knowledge)
  public knowledge!: Knowledge;
}

export default KnowledgeFile;
