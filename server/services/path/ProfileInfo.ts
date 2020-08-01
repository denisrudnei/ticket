import { ObjectType, Field, Int } from 'type-graphql';
import Info from './Info';

@ObjectType()
export default class ProfileInfo {
  @Field(() => Int)
  opened: number = 0;

  @Field(() => Int)
  total: number;

  @Field(() => [Info])
  categories: Info[];

  @Field(() => [Info])
  status: Info[];

  @Field(() => [Info])
  inName: Info[];

  constructor(
    opened: number,
    total: number,
    categories: Info[],
    status: Info[],
    inName: Info[],
  ) {
    this.opened = opened;
    this.total = total;
    this.categories = categories;
    this.status = status;
    this.inName = inName;
  }
}
