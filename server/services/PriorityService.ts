import Priority from '../models/ticket/Priority'

class PriorityService {
  create(priority: Priority): Promise<Priority> {
    return new Promise((resolve, reject) => {
      Priority.create({
        name: priority.name,
        weight: priority.weight
      })
        .save()
        .then(priority => {
          resolve(priority)
        })
    })
  }

  getAll(): Promise<Priority[]> {
    return new Promise((resolve, reject) => {
      Priority.find().then(result => {
        resolve(result)
      })
    })
  }

  getOne(id: Priority['id']): Promise<Priority> {
    return new Promise((resolve, reject) => {
      Priority.findOne(id).then(priority => {
        resolve(priority)
      })
    })
  }

  edit(priorityToEdit: Priority): Promise<Priority> {
    return new Promise((resolve, reject) => {
      Priority.findOne(priorityToEdit.id).then(priority => {
        priority!.name = priorityToEdit.name
        priority!.save().then(priority => {
          resolve(priority)
        })
      })
    })
  }

  editMany(priorities: Priority[]) {
    const all = priorities.map(priority => this.edit(priority))
    return Promise.all(all)
  }

  remove(priorityId: Priority['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Priority.delete(priorityId).then(() => {
        resolve()
      })
    })
  }
}

export default new PriorityService()
