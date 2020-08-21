import { Field, InputType } from 'type-graphql';

import AnalystStatus from '../enums/AnalystStatus';

@InputType()
class AnalystMergeInput {
  @Field()
  email!: string;

  @Field({ nullable: true })
  name!: string;

  @Field(() => AnalystStatus, { nullable: true })
  status!: AnalystStatus;

  @Field({ nullable: true })
  contactEmail!: string;

  @Field({ nullable: true })
  color!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  picture!: string;
}

export default AnalystMergeInput;
