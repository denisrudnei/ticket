import mongoose from 'mongoose'
import Status, { IStatus } from '../../models/ticket/Status'

class StatusService {
  getStatus(): Promise<IStatus> {
    return new Promise((resolve, reject) => {
      Status.find({})
        .populate(['allowedStatus'])
        .exec((err: Error, status: IStatus) => {
          if (err) return reject(err)
          return resolve(status)
        })
    })
  }

  getOne(statusId: IStatus['_id']): Promise<IStatus> {
    return new Promise((resolve, reject) => {
      Status.findOne({
        _id: statusId
      })
        .populate(['allowedStatus'])
        .exec((err: Error, status) => {
          if (err) return reject(err)
          return resolve(status)
        })
    })
  }

  create(status: IStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      const newStatus = new Status({
        _id: new mongoose.Types.ObjectId(),
        name: status.name
      })
      Status.create(newStatus, (err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  getAllowedStatus(_id: IStatus['_id']): Promise<[IStatus]> {
    return new Promise((resolve, reject) => {
      Status.findOne({
        _id
      })
        .populate(['allowedStatus'])
        .exec((err: Error, result: IStatus) => {
          if (err) return reject(err)
          return resolve(result.allowedStatus)
        })
    })
  }

  edit(statusId: IStatus['_id'], status: IStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      const allowedStatus = status.allowedStatus.filter(s => {
        return s._id !== statusId
      })
      Status.updateOne(
        {
          _id: statusId
        },
        {
          $set: {
            name: status.name,
            allowedStatus: allowedStatus
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

export default new StatusService()
