import Ticket from '~/server/models/ticket/Ticket';
import Analyst from '../models/Analyst';
import Category from '~/server/models/ticket/Category';
import Status from '~/server/models/ticket/Status';
import Knowledge from '~/server/models/knowledge/Knowledge';
import Group from '../models/ticket/Group';
import DatabaseItemsCount from '../models/DatabaseItemsCount';

class StatsService {
  static async getDatabaseItemsCount(): Promise<DatabaseItemsCount> {
    return {
      ticket: await Ticket.count(),
      analyst: await Analyst.count(),
      category: await Category.count(),
      knowledge: await Knowledge.count(),
      status: await Status.count(),
      group: await Group.count(),
      priority: await Group.count(),
    };
  }
}

export default StatsService;
