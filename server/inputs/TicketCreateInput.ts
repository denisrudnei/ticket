import { InputType, Field, ID } from 'type-graphql'
import Analyst from '../models/Analyst'
import Address from '../models/Address'
import Category from '../models/ticket/Category'
import Status from '../models/ticket/Status'
import Group from '../models/ticket/Group'
import Priority from '../models/ticket/Priority'

@InputType()
class TicketCreateInput {
  @Field(type => ID)
  actualUser!: Analyst['id']

  @Field(type => ID)
  openedBy!: Analyst['id']

  @Field(type => ID)
  affectedUser!: Analyst['id']

  @Field(type => ID)
  address!: Address['id']

  @Field(type => ID)
  category!: Category['id']

  @Field(type => ID)
  status!: Status['id']

  @Field(type => ID)
  group!: Group['id']

  @Field(type => ID)
  priority!: Priority['id']
}
export default TicketCreateInput
