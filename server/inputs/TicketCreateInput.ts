import { Field, ID, InputType } from 'type-graphql';

import Address from '../models/Address';
import Analyst from '../models/Analyst';
import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';
import Priority from '../models/ticket/Priority';
import Status from '../models/ticket/Status';

@InputType()
class TicketCreateInput {
  @Field((type) => String)
  public resume!: string;

  @Field((type) => String)
  public content!: string;

  @Field((type) => ID)
  actualUser!: Analyst['id'];

  @Field((type) => ID)
  affectedUser!: Analyst['id'];

  @Field((type) => ID)
  address!: Address['id'];

  @Field((type) => ID)
  category!: Category['id'];

  @Field((type) => ID)
  status!: Status['id'];

  @Field((type) => ID)
  group!: Group['id'];

  @Field((type) => ID)
  priority!: Priority['id'];
}

export default TicketCreateInput;
