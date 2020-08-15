import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import CategoryField from './CategoryField';
import Ticket from './Ticket';

@ObjectType()
@Entity()
class TicketField extends CategoryField {
  @Column()
  @Field()
  public value!: string;

  @ManyToOne(() => Ticket)
  public ticket!: Ticket;
}

export default TicketField;
