import { InputType, Field, ID } from 'type-graphql';
import Analyst from '../models/Analyst';
import Address from '../models/Address';
import Sound from '../models/Sound';
import AnalystStatus from '../enums/AnalystStatus';

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
