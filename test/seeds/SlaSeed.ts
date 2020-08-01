import { DeleteResult } from 'typeorm';
import Generate from './Generate';
import Seed from './Seed';
import Sla from '~/server/models/ticket/Sla';
import Category from '~/server/models/ticket/Category';

class SlaSeed implements Seed<Sla> {
  init(): Promise<Sla> {
    return Sla.create({
      name: 'sla name',
      limit: new Date(),
    }).save();
  }

  generateMany(number: number): Promise<Sla[]> {
    return Generate.many<SlaSeed>(new SlaSeed(), number);
  }

  destroy(): Promise<DeleteResult> {
    return Sla.delete({});
  }
}

export default SlaSeed;
