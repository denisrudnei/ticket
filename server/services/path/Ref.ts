import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class Ref {
  constructor(objectName: string, options: string[]) {
    this.objectName = objectName;
    this.options = options;
  }

  @Field()
  public objectName!: string;

  @Field(() => [String])
  public options!: string[];
}
