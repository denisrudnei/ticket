import { Field, ID, InputType } from 'type-graphql';

import AnalystStatus from '../enums/AnalystStatus';
import Address from '../models/Address';
import Sound from '../models/Sound';

@InputType()
class AnalystInput {
  @Field({ nullable: true })
  name!: string;

  @Field((type) => AnalystStatus, { nullable: true })
  status!: AnalystStatus;

  @Field({ nullable: true })
  contactEmail!: string;

  @Field({ nullable: true })
  color!: string;

  @Field((type) => ID, { nullable: true })
  address!: Address['id'];

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  picture!: string;

  @Field((type) => ID, { nullable: true })
  sounds!: Sound['id'];
}

export default AnalystInput;
