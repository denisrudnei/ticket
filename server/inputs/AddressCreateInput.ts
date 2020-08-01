import { InputType, Field } from 'type-graphql';

@InputType()
class AddressCreateInput {
  @Field({ nullable: false })
  public name!: string;

  @Field({ nullable: false })
  public country!: string;

  @Field({ nullable: false })
  public street!: string;

  @Field({ nullable: false })
  public cep!: string;

  @Field({ nullable: false })
  public city!: string;

  @Field({ nullable: false })
  public state!: string;
}

export default AddressCreateInput;
