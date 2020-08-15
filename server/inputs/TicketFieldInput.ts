import { InputType, Field } from 'type-graphql';

@InputType()
class TicketFieldInput {
  @Field()
  public required: boolean = false;

  @Field()
  public text!: string;

  @Field()
  public min!: number;

  @Field()
  public max!: number;

  @Field()
  public value!: string;
}

export default TicketFieldInput;
