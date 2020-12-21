import Ticket from '~/server/models/ticket/Ticket';
import Analyst from '../models/Analyst';
import Category from '~/server/models/ticket/Category';
import Status from '~/server/models/ticket/Status';
import Knowledge from '~/server/models/knowledge/Knowledge';
import Group from '../models/ticket/Group';
import DatabaseItemsCount from '../models/DatabaseItemsCount';

class StatsService {
  static async getDatabaseItemsCount(): Promise<DatabaseItemsCount[]> {
    return [
      { name: 'Ticket', total: await Ticket.count() },
      { name: 'Analyst', total: await Analyst.count() },
      { name: 'Category', total: await Category.count() },
      { name: 'Knowledge', total: await Knowledge.count() },
      { name: 'Status', total: await Status.count() },
      { name: 'Group', total: await Group.count() },
      { name: 'Priority', total: await Group.count() },
    ];
  }
}

export default StatsService;
