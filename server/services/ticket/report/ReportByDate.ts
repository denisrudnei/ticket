import {
  ObjectType, Field, ID, Int,
} from 'type-graphql';

@ObjectType()
export default class ReportByDate {
  constructor(date: string, total: number) {
    this.id = date;
    this.date = date;
    this.total = total;
  }

  @Field(() => ID)
  public id!: string;

  @Field()
  public date!: string;

  @Field(() => Int)
  public total!: number;
}
