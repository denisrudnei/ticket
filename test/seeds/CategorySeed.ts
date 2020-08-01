import { DeleteResult } from 'typeorm';
import Category from '../../server/models/ticket/Category';
import Generate from './Generate';
import Seed from './Seed';
import GroupSeed from './GroupSeed';
import StatusSeed from './StatusSeed';
import PrioritySeed from './PrioritySeed';
import Sla from '~/server/models/ticket/Sla';

class CategorySeed implements Seed<Category> {
  init(): Promise<Category> {
    return new Promise((resolve, reject) => {
      Sla.create({
        name: 'test',
        limit: new Date(),
      })
        .save()
        .then(async (sla) => {
          const category = Category.create();
          category.name = 'Test';
          category.description = 'test';
          category.sla = sla;
          category.defaultGroup = await new GroupSeed().init();
          category.defaultStatus = await new StatusSeed().init();
          category.defaultPriority = await new PrioritySeed().init();
          resolve(category.save());
        });
    });
  }

  generateMany(number: number): Promise<Category[]> {
    return Generate.many<CategorySeed>(new CategorySeed(), number);
  }

  destroy(): Promise<DeleteResult> {
    return Category.delete({});
  }
}
export default CategorySeed;
