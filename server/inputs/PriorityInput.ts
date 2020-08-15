import { Field, InputType, Int } from 'type-graphql';

@InputType()
class PriorityInput {
  @Field(() => Int)
  public weight!: number;

  @Field()
  public name!: String;
}

export default PriorityInput;
