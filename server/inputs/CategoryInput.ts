import { Field, ID, InputType } from 'type-graphql';

import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';
import Priority from '../models/ticket/Priority';
import Sla from '../models/ticket/Sla';
import Status from '../models/ticket/Status';
import CategoryFieldInput from './CategoryFieldInput';

@InputType()
class CategoryInput {
  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  fullName!: string;

  @Field({ nullable: true })
  description!: string;

  @Field(() => ID, { nullable: true })
  defaultGroup!: Group['id'];

  @Field(() => ID, { nullable: true })
  defaultStatus!: Status['id'];

  @Field(() => ID, { nullable: true })
  sla!: Sla['id'];

  @Field(() => ID, { nullable: true })
  father!: Category['id'];

  @Field(() => ID, { nullable: true })
  defaultPriority!: Priority['id'];

  @Field(() => [CategoryFieldInput])
  fields!: CategoryFieldInput[];
}

export default CategoryInput;
