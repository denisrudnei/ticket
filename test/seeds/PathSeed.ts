import { DeleteResult } from 'typeorm';
import Generate from './Generate';
import Seed from './Seed';
import Path from '~/server/models/Path';

class PathSeed implements Seed<Path> {
  init(): Promise<Path> {
    return Path.create({
      objectName: 'category',
      property: 'name',
      name: 'categories',
    }).save();
  }

  generateMany(number: number): Promise<Path[]> {
    return Generate.many<PathSeed>(new PathSeed(), number);
  }

  destroy(): Promise<DeleteResult> {
    return Path.delete({});
  }
}

export default PathSeed;
