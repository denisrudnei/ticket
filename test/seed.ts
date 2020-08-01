import consola from 'consola';
import AnalystSeed from './seeds/AnalystSeed';
import CategorySeed from './seeds/CategorySeed';
import TicketSeed from './seeds/TicketSeed';
import GroupSeed from './seeds/GroupSeed';
import StatusSeed from './seeds/StatusSeed';
import NotificationSeed from './seeds/NotificationSeed';
import AddressSeed from './seeds/AddressSeed';
import PathSeed from './seeds/PathSeed';
import SlaSeed from './seeds/SlaSeed';
import PrioritySeed from './seeds/PrioritySeed';
import Seed from './seeds/Seed';
import RoleSeed from './seeds/RoleSeed';
import KnowledgeStatusSeed from './seeds/KnowledgeStatusSeed';

class SeedExecutor {
  public data: Seed<any>[];

  constructor() {
    consola.info('Seed executor created');
    this.data = [
      new RoleSeed(),
      new AnalystSeed(),
      new CategorySeed(),
      new StatusSeed(),
      new GroupSeed(),
      new NotificationSeed(),
      new AddressSeed(),
      new PathSeed(),
      new PrioritySeed(),
      new SlaSeed(),
      new TicketSeed(),
      new KnowledgeStatusSeed(),
    ];
  }

  execute() {
    consola.info('Seeding database...');
    const seeds = this.data.map((d) => d.generateMany(5));
    return Promise.all(seeds);
  }

  destroy() {
    consola.info('Deleting data from db...');
    this.data.forEach((d) => {
      d.destroy();
    });
    consola.info('Data deleted');
  }
}

export default SeedExecutor;
