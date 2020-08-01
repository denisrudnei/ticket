import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
class KnowledgeStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  public id!: number;

  @Column()
  @Field((type) => String)
  public name!: string;

  @Field()
  @Column()
  public description!: string;
}

export default KnowledgeStatus;
