import { Field, ID, InputType } from 'type-graphql';

import Analyst from '../models/Analyst';
import Group from '../models/ticket/Group';
import Status from '../models/ticket/Status';

@InputType()
class ReportAttributes {
  @Field(() => [ID], { nullable: true })
  public group!: Group['id'][];

  @Field(() => [ID], { nullable: true })
  public status!: Status['id'][];

  @Field(() => [ID], { nullable: true })
  public openedBy!: Analyst['id'][];
}

export default ReportAttributes;
