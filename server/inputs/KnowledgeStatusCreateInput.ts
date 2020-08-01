import { InputType, Field } from 'type-graphql';

@InputType()
class KnowledgeStatusCreateInput {
  @Field()
  public name!: string;

  @Field()
  public description!: string;
}

export default KnowledgeStatusCreateInput;
