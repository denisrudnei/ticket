import { Field, ID, InputType } from 'type-graphql';

import Status from '../models/ticket/Status';

@InputType()
class StatusCreateInput {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field(() => [ID], { nullable: true })
  public allowedStatus: Status['id'][] = [];

  @Field(() => Boolean, { nullable: true })
  public slaRun = false;
}
export default StatusCreateInput;
