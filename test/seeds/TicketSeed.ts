import faker from 'faker';
import { DeleteResult } from 'typeorm';
import Ticket from '../../server/models/ticket/Ticket';
import CategorySeed from './CategorySeed';
import GroupSeed from './GroupSeed';
import StatusSeed from './StatusSeed';
import Seed from './Seed';
import Generate from './Generate';
import AddressSeed from './AddressSeed';
import PrioritySeed from './PrioritySeed';
import Analyst from '~/server/models/Analyst';

class TicketSeed implements Seed<Ticket> {
  init(): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      new CategorySeed().init().then(async (category) => {
        const ticket = new Ticket();
        const analyst = await Analyst.findOne();
        ticket.address = await new AddressSeed().init();
        ticket.resume = faker.lorem.words(5);
        ticket.content = faker.lorem.paragraph();
        ticket.category = category;
        ticket.actualUser = analyst!;
        ticket.affectedUser = analyst!;
        ticket.openedBy = analyst!;
        ticket.priority = await new PrioritySeed().init();
        ticket.group = await new GroupSeed().init();
        ticket.status = await new StatusSeed().init();
        resolve(Ticket.create(ticket).save());
      });
    });
  }

  generateMany(number: number): Promise<Ticket[]> {
    return Generate.many<TicketSeed>(new TicketSeed(), number);
  }

  destroy(): Promise<DeleteResult> {
    return Ticket.delete({});
  }
}
export default TicketSeed;
