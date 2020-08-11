import Ticket from '~/server/models/ticket/Ticket';

import ComposedDate from './ComposedDate';

export default class TicketWithComposedDate extends Ticket {
  constructor(ticketBase: Ticket, composedDate: ComposedDate) {
    super();
    Object.assign(this, ticketBase);
    this.composedDate = `${composedDate.day}/${composedDate.month}/${composedDate.year}`;
  }

  public composedDate!: string;
}
