import Ticket from '@/server/models/ticket/Ticket';
import { DeepPartial, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import lodash from 'lodash';
import GroupedResult from './GroupedResult';
import ReportByDate from './ReportByDate';
import TicketWithComposedDate from './TicketWithComposedDate';
import ComposedDate from './ComposedDate';

export enum TicketTimeField {
  created = 'created',
  modified = 'modified',
}

class ReportService {
  static reportGrouped(
    attributes: DeepPartial<Ticket>,
    field: string,
  ): Promise<GroupedResult[]> {
    return new Promise((resolve, reject) => {
      // attributes
      Ticket.find({}).then((tickets) => {
        const grouped = lodash.groupBy(tickets, `${field}.name`);
        const result = Object.keys(grouped).map(
          (name) => new GroupedResult(name, grouped[name].length),
        );
        resolve(result);
      });
    });
  }

  static reportByDate(
    field: TicketTimeField,
    start = new Date(),
    end = new Date(),
  ): Promise<ReportByDate[]> {
    return new Promise((resolve, reject) => {
      // {
      //   where: {
      //     [field]: MoreThanOrEqual(start),
      //     [field]: LessThanOrEqual(end)
      //   }
      // }
      Ticket.find().then((tickets) => {
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

        resolve(result);
      });
    });
  }
}

export default ReportService;
