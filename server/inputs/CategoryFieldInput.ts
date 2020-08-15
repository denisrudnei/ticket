import { InputType, Field } from 'type-graphql';

@InputType()
class CategoryFieldInput {
  @Field()
  public required: boolean = false;

  @Field()
  public text!: string;

  @Field()
  public min!: number;

  @Field()
  public max!: number;
}

export default CategoryFieldInput;
