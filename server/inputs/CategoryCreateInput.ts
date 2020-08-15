import { Field, ID, InputType } from 'type-graphql';

import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';
import Priority from '../models/ticket/Priority';
import Sla from '../models/ticket/Sla';
import Status from '../models/ticket/Status';
import CategoryFieldInput from './CategoryFieldInput';

@InputType()
class CategoryCreateInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => ID)
  defaultGroup!: Group['id'];

  @Field(() => ID)
  defaultStatus!: Status['id'];

  @Field(() => ID)
  sla!: Sla['id'];

  @Field(() => ID, { nullable: true })
  father!: Category['id'];

  @Field(() => ID)
  defaultPriority!: Priority['id'];

  @Field(() => [CategoryFieldInput], { nullable: true })
  fields!: CategoryFieldInput[];
}

export default CategoryCreateInput;
