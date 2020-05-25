import { ObjectType, Field, Int } from 'type-graphql'
import Ticket from './ticket/Ticket'

@ObjectType()
class TicketPagination {
  constructor(
    docs: Ticket[],
    total: number,
    page: number,
    pages: number,
    limit: number
  ) {
    this.docs = docs
    this.total = total
    this.page = page
    this.pages = pages
    this.limit = limit
  }

  @Field(type => [Ticket])
  public docs!: Ticket[]

  @Field(type => Int)
  total!: number

  @Field(type => Int)
  page!: number

  @Field(type => Int)
  pages!: number

  @Field(type => Int)
  limit!: number
}

export default TicketPagination
