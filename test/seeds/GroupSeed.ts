import { DeleteResult } from 'typeorm';
import Generate from './Generate';
import Seed from './Seed';
import Group from '~/server/models/ticket/Group';

class GroupSeed implements Seed<Group> {
  init(): Promise<Group> {
    return Group.create({
      name: 'group',
      description: 'test',
    }).save();
  }

  generateMany(number: number): Promise<Group[]> {
    return Generate.many<GroupSeed>(new GroupSeed(), number);
  }

  destroy(): Promise<DeleteResult> {
    return Group.delete({});
  }
}

export default GroupSeed;
