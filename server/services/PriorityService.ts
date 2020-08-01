import Priority from '../models/ticket/Priority';

class PriorityService {
  static async create(priority: Priority): Promise<Priority> {
    const newPriority = await Priority.create({
      name: priority.name,
      weight: priority.weight,
    }).save();
    return newPriority;
  }

  static getAll(): Promise<Priority[]> {
    return new Promise((resolve, reject) => {
      Priority.find().then((result) => {
        resolve(result);
      });
    });
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

  static remove(priorityId: Priority['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Priority.delete(priorityId).then(() => {
        resolve();
      });
    });
  }
}

export default PriorityService;
