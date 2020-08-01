import { InputType, Field, ID } from 'type-graphql';
import Group from '../models/ticket/Group';
import Status from '../models/ticket/Status';
import Analyst from '../models/Analyst';

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
