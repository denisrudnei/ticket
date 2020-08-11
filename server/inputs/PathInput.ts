import { Field, InputType } from 'type-graphql';

@InputType()
class PathInput {
  @Field()
  public name!: String;

  @Field()
  public objectName!: String;

  @Field()
  public property!: String;
}

export default PathInput;
