import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
class Address extends BaseEntity {
  constructor(address?: Partial<Address>) {
    super();
    Object.assign(this, address);
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public country!: string;

  @Column()
  @Field()
  public street!: string;

  @Column()
  @Field()
  public cep!: string;

  @Column()
  @Field()
  public city!: string;

  @Column()
  @Field()
  public state!: string;
}

export default Address;
