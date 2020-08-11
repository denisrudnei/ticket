import Ticket from '@/server/models/ticket/Ticket';
import lodash from 'lodash';
import { DeepPartial } from 'typeorm';

import ComposedDate from './ComposedDate';
import GroupedResult from './GroupedResult';
import ReportByDate from './ReportByDate';
import TicketWithComposedDate from './TicketWithComposedDate';

export enum TicketTimeField {
  created = 'created',
  modified = 'modified',
}

class ReportService {
  static async reportGrouped(
    attributes: DeepPartial<Ticket>,
    field: string,
  ): Promise<GroupedResult[]> {
    // attributes
    const tickets = await Ticket.find({});
    const grouped = lodash.groupBy(tickets, `${field}.name`);
    const result = Object.keys(grouped).map(
      (name) => new GroupedResult(name, grouped[name].length),
    );
    return result;
  }

  static async reportByDate(
    field: TicketTimeField,
    start = new Date(),
    end = new Date(),
  ): Promise<ReportByDate[]> {
    // {
    //   where: {
    //     [field]: MoreThanOrEqual(start),
    //     [field]: LessThanOrEqual(end)
    //   }
    // }
    const tickets = await Ticket.find();
    const ticketsWithNewDates = tickets.map((ticket) => {
      const [year, month, day] = ticket[field]
        .toISOString()
        .split('T')[0]
        .split('-')
        .map((value) => parseInt(value, 10));
      const composedDate = new ComposedDate(day, month, year);

      return new TicketWithComposedDate(ticket, composedDate);
    });
    const grouped = lodash.groupBy(ticketsWithNewDates, 'composedDate');
    const result = Object.keys(grouped).map(
      (name) => new ReportByDate(name, grouped[name].length),
    );

    return result;
  }
}

export default ReportService;
