import { Field, ID, InputType } from 'type-graphql';

import KnowledgeFile from '../models/knowledge/KnowledgeFile';
import KnowledgeStatus from '../models/knowledge/KnowledgeStatus';
import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';

@InputType()
class KnowledgeInput {
  @Field((type) => String)
  public name!: string;

  @Field((type) => Date)
  public created: Date = new Date();

  @Field(() => ID)
  public category!: Category['id'];

  @Field(() => ID)
  public group!: Group['id'];

  @Field((type) => ID, { nullable: true })
  public status!: KnowledgeStatus['id'];

  @Field((type) => String)
  public url: string = '';

  @Field((type) => String)
  public description!: string;

  @Field((type) => [ID], { nullable: true })
  public files!: KnowledgeFile['id'];
}

export default KnowledgeInput;
