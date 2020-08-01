import faker from 'faker';
import { DeleteResult } from 'typeorm';
import Analyst from '../../server/models/Analyst';
import Generate from './Generate';
import Seed from './Seed';
import RoleSeed from './RoleSeed';

class AnalystSeed implements Seed<Analyst> {
  init(): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      new RoleSeed().init().then((role) => {
        const analyst = new Analyst();
        analyst.email = faker.internet.email();
        analyst.name = faker.name.firstName();
        analyst.role = role;
        analyst.color = '#fff';
        analyst.password = faker.internet.password();
        analyst.address = null;
        analyst.active = true;

        resolve(analyst.save());
      });
    });
  }

  generateMany(number: number): Promise<Analyst[]> {
    return Generate.many<AnalystSeed>(new AnalystSeed(), number);
  }

  destroy(): Promise<DeleteResult> {
    return Analyst.delete({});
  }
}

export default AnalystSeed;
