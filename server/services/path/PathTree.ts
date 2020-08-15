import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class PathTree {
  @Field()
  public id: string;

  @Field()
  public name: string = '';

  @Field()
  public url!: string;

  @Field(() => [PathTree])
  children: PathTree[];

  constructor(name: string, url: string, children: PathTree[]) {
    this.id = name;
    this.name = name;
    this.url = url;
    this.children = children;
  }
}
