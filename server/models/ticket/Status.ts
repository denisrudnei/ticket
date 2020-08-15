import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import Ticket from './Ticket';

@Entity()
@ObjectType()
class Status extends BaseEntity {
  constructor(status?: Partial<Status>) {
    super();
    Object.assign(this, status);
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true })
  @Field()
  public description!: string;

  @ManyToMany(() => Status)
  @JoinTable()
  @Field(() => [Status])
  public allowedStatus!: Status[];

  @Column()
  @Field()
  public slaRun: boolean = false;

  @OneToMany(() => Ticket, (status) => status)
  @Field(() => [Ticket])
  public tickets!: Ticket[];
}

export default Status;
