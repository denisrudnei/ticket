import Log from '../../models/ticket/Log';
import Ticket from '../../models/ticket/Ticket';
import Analyst from '../../models/Analyst';

class LogService {
  static async createTicketLog(
    actualUser: Analyst['id'],
    ticketId: Ticket['id'],
  ): Promise<void> {
    const analyst = await Analyst.findOne(actualUser);
    const log = new Log();
    const ticket = await Ticket.findOne(ticketId, { relations: ['logs'] });

    log.oldStatus = ticket!.status;
    log.date = new Date();
    log.user = analyst!;
    log.group = ticket!.group;
    const logSaved = await Log.create(log).save();
    ticket!.logs.push(logSaved);
    await ticket!.save();
  }
}

export default LogService;
