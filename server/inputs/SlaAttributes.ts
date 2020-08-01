import { Field, InputType } from 'type-graphql';

@InputType()
class SlaAttributes {
  @Field()
  public limit!: Date;

  @Field()
  public name!: string;
}

export default SlaAttributes;
