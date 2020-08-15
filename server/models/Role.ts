import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public description!: string;
}

export default Role;
