import { InputType, Field, Int, ID } from 'type-graphql'
import Group from '../models/ticket/Group'
import Priority from '../models/ticket/Priority'
import Status from '../models/ticket/Status'
import Sla from '../models/ticket/Sla'
import Category from '../models/ticket/Category'

@InputType()
class CategoryCreateInput {
  @Field()
  name!: string

  @Field()
  description!: string

  @Field(() => ID)
  defaultGroup!: Group['id']

  @Field(() => ID)
  defaultStatus!: Status['id']

  @Field(() => ID)
  sla!: Sla['id']

  @Field(() => ID, { nullable: true })
  father!: Category['id']

  @Field(() => ID)
  defaultPriority!: Priority['id']
}

export default CategoryCreateInput
