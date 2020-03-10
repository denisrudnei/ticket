import { Types } from 'mongoose'
import Priority, { IPriority } from '../models/ticket/Priority'

class PriorityService {
  create(priority: IPriority): Promise<void> {
    return new Promise((resolve, reject) => {
      Priority.create(
        {
          _id: new Types.ObjectId(),
          name: priority.name,
          weight: priority.weight
        },
        (err: Error) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }

  getAll(): Promise<IPriority[]> {
    return new Promise((resolve, reject) => {
      Priority.find().exec((err: Error, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  getOne(_id: IPriority['_id']): Promise<IPriority> {
    return Priority.findOne({ _id: _id }).exec()
  }

  edit(priority: IPriority): Promise<void> {
    return new Promise((resolve, reject) => {
      Priority.updateOne(
        {
          _id: priority._id
        },
        {
          $set: {
            name: priority.name,
            weight: priority.weight
          }
        },
        err => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }

  editMany(priorities: [IPriority]) {
    const all = priorities.map(priority => this.edit(priority))
    return Promise.all(all)
  }

  remove(priorityId: Types.ObjectId): Promise<void> {
    return new Promise((resolve, reject) => {
      Priority.deleteOne(
        {
          _id: priorityId
        },
        err => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }
}

export default new PriorityService()
