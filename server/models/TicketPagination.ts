import { Field, Int, ObjectType } from 'type-graphql';

import Ticket from './ticket/Ticket';

@ObjectType()
class TicketPagination {
  constructor(
    docs: Ticket[],
    total: number,
    page: number,
    pages: number,
    limit: number,
  ) {
    this.docs = docs;
    this.total = total;
    this.page = page;
    this.pages = pages;
    this.limit = limit;
  }

  @Field(() => [Ticket])
  public docs!: Ticket[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pages!: number;

  @Field(() => Int)
  limit!: number;
}

export default TicketPagination;
