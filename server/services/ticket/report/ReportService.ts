import Ticket from '@/server/models/ticket/Ticket';
import { getDate, getMonth, getYear } from 'date-fns';
import lodash from 'lodash';
import { Between, In, Raw } from 'typeorm';
import ReportAttributes from '~/server/inputs/ReportAttributes';

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
    attributes: Partial<ReportAttributes>,
    field: string,
  ): Promise<GroupedResult[]> {
    const findAttributes = Object.entries(attributes).map((item) => {
      const [key, value] = item;
      return {
        [key]: value && value.length > 1 ? In(value) : Raw(() => 'TRUE'),
      };
    });
    const tickets = await Ticket.find({
      where: findAttributes,
    });
    const grouped = lodash.groupBy(tickets, `${field}.name`);
    const result = Object.keys(grouped).map(
      (name) => new GroupedResult(name, grouped[name].length),
    );
    return result;
  }

  static async reportByDate(
    field: TicketTimeField,
    start = new Date(),
    finish = new Date(),
  ): Promise<ReportByDate[]> {
    const tickets = await Ticket.find({
      where: {
        [field]: Between(start, finish),
      },
    });

    const ticketsWithNewDates = tickets.map((ticket) => {
      const year = getYear(ticket[field]);
      const month = getMonth(ticket[field]) + 1;
      const day = getDate(ticket[field]);

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
