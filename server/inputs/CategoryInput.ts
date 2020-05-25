import { InputType, Field, Int, ID } from 'type-graphql'
import Group from '../models/ticket/Group'
import Priority from '../models/ticket/Priority'
import Status from '../models/ticket/Status'
import Sla from '../models/ticket/Sla'
import Category from '../models/ticket/Category'

@InputType()
class CategoryInput {
  @Field({ nullable: true })
  name!: string

  @Field({ nullable: true })
  fullName!: string

  @Field({ nullable: true })
  description!: string

  @Field(() => ID, { nullable: true })
  defaultGroup!: Group['id']

  @Field(() => ID, { nullable: true })
  defaultStatus!: Status['id']

  @Field(() => ID, { nullable: true })
  sla!: Sla['id']

  @Field(() => ID, { nullable: true })
  father!: Category['id']

  @Field(() => ID, { nullable: true })
  defaultPriority!: Priority['id']
}

export default CategoryInput
