import mongoose from 'mongoose'
import Group, { IGroup } from '../../models/ticket/Group'
import { IAnalyst } from '../../models/Analyst'

class GroupService {
  getAll(): Promise<[IGroup]> {
    return new Promise((resolve, reject) => {
      Group.find({}, (err: Error, groups: [IGroup]) => {
        if (err) return reject(err)
        if (groups === null) return reject(new Error('No group found'))
        return resolve(groups)
      })
    })
  }

  getOne(groupId: IGroup['_id']): Promise<IGroup> {
    return new Promise((resolve, reject) => {
      Group.findOne({
        _id: groupId
      })
        .populate(['analysts'])
        .exec((err: Error, group) => {
          if (err) return reject(err)
          if (group === null) return reject(new Error('No group found'))
          return resolve(group)
        })
    })
  }

  create(group: IGroup): Promise<void> {
    return new Promise((resolve, reject) => {
      const newGroup = new Group({
        _id: new mongoose.Types.ObjectId(),
        ...group
      })

      Group.create(newGroup, (err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  edit(groupId: IGroup['_id'], group: IGroup): Promise<void> {
    return new Promise((resolve, reject) => {
      Group.updateOne(
        {
          _id: groupId
        },
        {
          $set: {
            name: group.name,
            analysts: group.analysts
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  insertAnalyst(
    groupId: IGroup['_id'],
    analystId: IAnalyst['_id']
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Group.updateOne(
        { _id: groupId },
        {
          $addToSet: {
            analysts: [analystId]
          }
        },
        err => {
          if (err) return reject(err)
          return resolve()
        }
      )
    })
  }

  removeAnalyst(
    groupId: IGroup['_id'],
    analystId: IAnalyst['_id']
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Group.updateOne(
        { _id: groupId },
        {
          $pull: {
            analysts: {
              $in: [analystId]
            }
          }
        },
        err => {
          if (err) return reject(err)
          return resolve()
        }
      )
    })
  }
}

export default new GroupService()
