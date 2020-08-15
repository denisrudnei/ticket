import { Field, ID, InputType } from 'type-graphql';

import Address from '../models/Address';
import Analyst from '../models/Analyst';
import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';
import Priority from '../models/ticket/Priority';
import Status from '../models/ticket/Status';
import TicketFieldInput from './TicketFieldInput';

@InputType()
class TicketCreateInput {
  @Field(() => String)
  public resume!: string;

  @Field(() => String)
  public content!: string;

  @Field(() => ID)
  actualUser!: Analyst['id'];

  @Field(() => ID)
  affectedUser!: Analyst['id'];

  @Field(() => ID)
  address!: Address['id'];

  @Field(() => ID)
  category!: Category['id'];

  @Field(() => ID)
  status!: Status['id'];

  @Field(() => ID)
  group!: Group['id'];

  @Field(() => ID)
  priority!: Priority['id'];

  @Field(() => [TicketFieldInput], { nullable: true })
  fields?: TicketFieldInput[];
}

export default TicketCreateInput;
