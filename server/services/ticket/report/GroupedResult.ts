import {
  ObjectType, Field, ID, Int,
} from 'type-graphql';

@ObjectType()
export default class GroupedResult {
  constructor(name: string, total: number) {
    this.id = name;
    this.name = name;
    this.total = total;
  }

  @Field(() => ID)
  public id!: string;

  @Field()
  public name!: string;

  @Field((type) => Int)
  public total!: number;
}
