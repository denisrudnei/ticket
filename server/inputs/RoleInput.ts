import { Field, InputType } from 'type-graphql';

@InputType()
class RoleInput {
  @Field({ nullable: true })
  public description!: string;
}

export default RoleInput;
