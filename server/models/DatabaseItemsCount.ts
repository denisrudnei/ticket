import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class DatabaseItemsCount {
  @Field()
  ticket!: number;

  @Field()
  analyst!: number;

  @Field()
  category!: number;

  @Field()
  status!: number;

  @Field()
  knowledge!: number;

  @Field()
  group!: number;

  @Field()
  priority!: number;
}

export default DatabaseItemsCount;
