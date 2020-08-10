import Priority from '../models/ticket/Priority';

class PriorityService {
  static async create(priority: Priority): Promise<Priority> {
    const newPriority = await Priority.create({
      name: priority.name,
      weight: priority.weight,
    }).save();
    return newPriority;
  }

  static async getAll(): Promise<Priority[]> {
    return Priority.find();
  }

  static async getOne(id: Priority['id']): Promise<Priority> {
    const priority = await Priority.findOne(id);
    return priority!;
  }

  static async edit(priorityToEdit: Priority): Promise<Priority> {
    const priority = await Priority.findOne(priorityToEdit.id);
    priority!.name = priorityToEdit.name;
    return priority!.save();
  }

  static editMany(priorities: Priority[]) {
    const all = priorities.map((priority) => PriorityService.edit(priority));
    return Promise.all(all);
  }

  static async remove(priorityId: Priority['id']): Promise<void> {
    await Priority.delete(priorityId);
  }
}

export default PriorityService;
