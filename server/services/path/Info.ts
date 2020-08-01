import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export default class Info {
  @Field()
  name: string;

  @Field(() => Int)
  total: number;

  constructor(name: string, total: number) {
    this.name = name;
    this.total = total;
  }
}
