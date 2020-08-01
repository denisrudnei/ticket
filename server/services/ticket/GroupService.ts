import Group from '../../models/ticket/Group';
import Analyst from '../../models/Analyst';

class GroupService {
  static async getAll(): Promise<Group[]> {
    return Group.find({ relations: ['analysts'] });
  }

  static async getOne(groupId: Group['id']): Promise<Group> {
    const group = await Group.findOne(groupId);
    if (!group) throw new Error('No group found');
    return group;
  }

  static async create(group: Group): Promise<Group> {
    return Group.create(group).save();
  }

  static async edit(groupId: Group['id'], groupToEdit: Group): Promise<Group> {
    const group = await Group.findOne(groupId, { relations: ['analysts'] });
    if (!group) throw new Error('Group not found');
    Object.assign(group, groupToEdit);
    return group!.save();
  }

  static async insertAnalyst(
    groupId: Group['id'],
    analystId: Analyst['id'],
  ): Promise<Group> {
    const group = await Group.findOne(groupId, { relations: ['analysts'] });

    const analyst = await Analyst.findOne(analystId);
    group!.analysts.push(analyst!);
    return group!.save();
  }

  static async removeAnalyst(
    groupId: Group['id'],
    analystId: Analyst['id'],
  ): Promise<Group> {
    const group = await Group.findOne(groupId, { relations: ['analysts'] });
    const analyst = await Analyst.findOne(analystId);
    group!.analysts.push(analyst!);
    return group!.save();
  }
}

export default GroupService;
