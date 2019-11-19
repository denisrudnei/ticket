import Notification, { INotification } from '../models/Notification'
const fields = ['to', 'from']
import TicketService from '../services/ticket/TicketService'
import GroupService from '../services/ticket/GroupService'
import AnalystService from '../services/AnalystService'
import Log from '../models/ticket/Log'
import mongoose from 'mongoose'
import { IAnalyst } from '../models/Analyst'
import { ITicket } from '../models/ticket/Ticket'
import { IGroup } from '../models/ticket/Group'

class NotificationService {
  getAll(userId: IAnalyst['_id']) {
    return new Promise((resolve, reject) => {
      Notification.find({
        to: {
          $in: [userId]
        }
      })
        .populate(fields)
        .exec((err: Error, notifications) => {
          if (err) return reject(err)
          return resolve(notifications)
        })
    })
  }
  getOne(id: INotification['_id']): Promise<INotification> {
    return new Promise((resolve, reject) => {
      Notification.findOne({ _id: id })
        .populate(fields)
        .exec((err: Error, notification) => {
          if (err) return reject(err)
          return resolve(notification)
        })
    })
  }
  read(userId: IAnalyst['_id'], notificationId: INotification['_id']): Promise<INotification> {
    return new Promise((resolve, reject) => {
      Notification.updateOne(
        {
          _id: notificationId
        },
        {
          $addToSet: {
            read: [userId]
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve(this.getOne(notificationId))
      })
    })
  }
  unRead(userId: IAnalyst['_id'], notificationId: INotification['_id']): Promise<INotification> {
    return new Promise((resolve, reject) => {
      Notification.updateOne(
        {
          _id: notificationId
        },
        {
          $pull: {
            read: {
              $in: [userId]
            }
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve(this.getOne(notificationId))
      })
    })
  }
  toggleRead(userId: IAnalyst['_id'], notificationId: INotification['_id']) {
    return new Promise((resolve, reject) => {
      return this.getOne(notificationId).then(notification => {
        const read = notification.read.includes(userId)
        if (read) return resolve(this.unRead(userId, notificationId))
        return resolve(this.read(userId, notificationId))
      })
    })
  }
  readall(userId: IAnalyst['_id']) {
    return new Promise((resolve, reject) => {
      Notification.updateMany(
        {
          to: {
            $in: [userId]
          }
        },
        {
          $addToSet: {
            read: [userId]
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve(this.getAll(userId))
      })
    })
  }
  triggerForTicketTransfer(ticketId: ITicket['_id'], groupId: IGroup['_id'], analystId: IAnalyst['_id']) {
    return new Promise(async (resolve, reject) => {
      const ticket = await TicketService.getOne(ticketId)
      const group = await GroupService.getOne(groupId)
      const analyst = await AnalystService.getOne(analystId)

      Notification.create(
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'TicketTransfer',
          from: analyst._id,
          to: group.analysts,
          meta: {
            ticket
          },
          content: `${analyst.name} transferiu um chamado para seu grupo`
        },
        (err: Error, notification: INotification) => {
          if (err) reject(err)
          resolve(notification)
        }
      )
    })
  }
}

export default new NotificationService()
