import { Field, ID, InputType } from 'type-graphql';

import Analyst from '../models/Analyst';

@InputType()
class GroupEditInput {
  @Field(() => ID, { nullable: true })
  public id!: number;

  @Field({ nullable: true })
  public name!: string;

  @Field({ nullable: true })
  public description!: string;

  @Field(() => [ID], { nullable: true })
  public analysts!: Analyst['id'][];
}

export default GroupEditInput;
