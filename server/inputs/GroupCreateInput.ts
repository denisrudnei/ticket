import { Field, ID, InputType } from 'type-graphql';

import Analyst from '../models/Analyst';

@InputType()
class GroupCreateInput {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field(() => [ID], { nullable: true })
  public analysts!: Analyst['id'][];
}

export default GroupCreateInput;
