import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class DatabaseItemsCount {
  @Field()
  name!: string;

  @Field()
  total!: number;
}

export default DatabaseItemsCount;
