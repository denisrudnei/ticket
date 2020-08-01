import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @Field((type) => ID)
  public id!: number;

  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true })
  @Field()
  public description!: string;

  @ManyToMany((type) => Status)
  @JoinTable()
  @Field((type) => [Status])
  public allowedStatus!: Status[];

  @Column()
  @Field()
  public slaRun: boolean = false;

  @OneToMany((type) => Ticket, (status) => status)
  @Field((type) => [Ticket])
  public tickets!: Ticket[];
}

export default Status;
