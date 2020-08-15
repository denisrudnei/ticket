import { Field, ID, InputType } from 'type-graphql';

import Address from '../models/Address';
import Analyst from '../models/Analyst';
import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';
import Priority from '../models/ticket/Priority';
import Status from '../models/ticket/Status';
import Ticket from '../models/ticket/Ticket';

@InputType()
class TicketAttributes {
  @Field(() => ID, { nullable: true })
  actualUser!: Analyst['id'];

  @Field(() => ID, { nullable: true })
  openedBy!: Analyst['id'];

  @Field(() => ID, { nullable: true })
  affectedUser!: Analyst['id'];

  @Field(() => ID, { nullable: true })
  address!: Address['id'];

  @Field(() => ID, { nullable: true })
  category!: Category['id'];

  @Field(() => ID, { nullable: true })
  status!: Status['id'];

  @Field(() => ID, { nullable: true })
  group!: Group['id'];

  @Field(() => ID, { nullable: true })
  priority!: Priority['id'];

  @Field(() => ID, { nullable: true })
  id!: Ticket['id'][];
}

export default TicketAttributes;
