import { In } from 'typeorm'
import Notification from '../models/Notification'
import TicketService from '../services/ticket/TicketService'
import GroupService from '../services/ticket/GroupService'
import AnalystService from '../services/AnalystService'
import Analyst from '../models/Analyst'
import Ticket from '../models/ticket/Ticket'
import Group from '../models/ticket/Group'
import TicketEnum from '../enums/TicketEnum'

class NotificationService {
  getAll(userId: Analyst['id']): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      Notification.find({
        relations: ['to']
      }).then(result => {
        const notifications = result.filter(notification => {
          const needToReceiveId = notification.to.map(to => to.id)
          return needToReceiveId.includes(userId)
        })
        resolve(notifications)
      })
    })
  }

  getOne(id: Notification['id']): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Notification.findOne(id).then(notification => {
        return resolve(notification)
      })
    })
  }

  getWhoRead(notificationId: Notification['id']): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Notification.findOne(notificationId, { relations: ['read'] }).then(
        result => {
          resolve(result!.read)
        }
      )
    })
  }

  read(
    userId: Analyst['id'],
    notificationId: Notification['id']
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(async analyst => {
        const notification = await Notification.findOne(notificationId, {
          relations: ['read']
        })
        notification!.read.push(analyst!)
        notification!.save().then(() => {
          resolve(notification)
        })
      })
    })
  }

  unRead(
    userId: Analyst['id'],
    notificationId: Notification['id']
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Notification.findOne(notificationId).then(notification => {
        if (!notification!.read) notification!.read = []
        notification!.read = notification!.read.filter(analyst => {
          return analyst.id !== userId
        })
        resolve(notification)
      })
    })
  }

  toggleRead(
    userId: Analyst['id'],
    notificationId: Notification['id']
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Notification.findOne(notificationId, { relations: ['read'] }).then(
        notification => {
          const read = notification!.read
            .map(analyst => analyst.id)
            .includes(userId)
          if (read) resolve(this.unRead(userId, notificationId))
          resolve(this.read(userId, notificationId))
        }
      )
    })
  }

  readall(userId: Analyst['id']): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, {
        relations: ['notificationsToMe']
      }).then(user => {
        const updates = user!.notificationsToMe.map(notification => {
          notification.read.push(user!)
          notification!.save()
        })
        Promise.all(updates).then(() => {
          resolve(this.getAll(userId))
        })
      })
    })
  }

  triggerForTicketCreation(newTicket: Ticket): Promise<Notification> {
    return new Promise((resolve, reject) => {
      const notification = Notification.create()
      notification.name = 'TicketCreate'
      notification.from = newTicket!.openedBy
      notification.to = newTicket!.group.analysts
      notification.type = TicketEnum.TICKET_CREATE
      notification.content = `${newTicket!.openedBy.name} opened a new ticket`
      notification
        .save()
        .then(notification => resolve(notification))
        .catch((err: Error) => reject(err))
    })
  }

  triggerForTicketTransfer(
    ticketId: Ticket['id'],
    groupId: Group['id'],
    analystId: Analyst['id']
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      AnalystService.getOne(analystId).then(async analyst => {
        const ticket = await TicketService.getOne(ticketId)
        const group = await Group.findOne(groupId, { relations: ['analysts'] })

        const notification = Notification.create()

        notification.name = 'TicketTransfer'
        notification.from = analyst
        notification.to = group!.analysts
        notification.type = TicketEnum.TICKETS_TRANSFER_TO_GROUP
        // meta: {
        //   ticket
        // },
        notification.content = `${
          analyst.name
        } transferiu um chamado para seu grupo`

        resolve(notification.save())
      })
    })
  }
}

export default new NotificationService()
