import { InputType, Field, ID } from 'type-graphql'
import Analyst from '../models/Analyst'
import Address from '../models/Address'
import Category from '../models/ticket/Category'
import Status from '../models/ticket/Status'
import Group from '../models/ticket/Group'
import Priority from '../models/ticket/Priority'
import Ticket from '../models/ticket/Ticket'

@InputType()
class TicketInput {
  @Field(type => String, { nullable: true })
  public resume!: string

  @Field(type => String, { nullable: true })
  public content!: string

  @Field(type => ID, { nullable: true })
  actualUser!: Analyst['id']

  @Field(type => ID, { nullable: true })
  openedBy!: Analyst['id']

  @Field(type => ID, { nullable: true })
  affectedUser!: Analyst['id']

  @Field(type => ID, { nullable: true })
  address!: Address['id']

  @Field(type => ID, { nullable: true })
  category!: Category['id']

  @Field(type => ID, { nullable: true })
  status!: Status['id']

  @Field(type => ID, { nullable: true })
  group!: Group['id']

  @Field(type => ID, { nullable: true })
  priority!: Priority['id']

  @Field(type => ID, { nullable: true })
  id!: Ticket['id'][]
}
export default TicketInput
