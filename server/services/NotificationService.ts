import { In } from 'typeorm';
import Notification from '../models/Notification';
import TicketService from '../services/ticket/TicketService';
import GroupService from '../services/ticket/GroupService';
import AnalystService from '../services/AnalystService';
import Analyst from '../models/Analyst';
import Ticket from '../models/ticket/Ticket';
import Group from '../models/ticket/Group';
import TicketEnum from '../enums/TicketEnum';

class NotificationService {
  static getAll(userId: Analyst['id']): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      Notification.find({
        relations: ['to'],
      }).then((result) => {
        const notifications = result.filter((notification) => {
          const needToReceiveId = notification.to.map((to) => to.id);
          return needToReceiveId.includes(userId);
        });
        resolve(notifications);
      });
    });
  }

  static getOne(id: Notification['id']): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Notification.findOne(id).then((notification) => resolve(notification));
    });
  }

  static getWhoRead(notificationId: Notification['id']): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Notification.findOne(notificationId, { relations: ['read'] }).then(
        (result) => {
          resolve(result!.read);
        },
      );
    });
  }

  static read(
    userId: Analyst['id'],
    notificationId: Notification['id'],
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(async (analyst) => {
        const notification = await Notification.findOne(notificationId, {
          relations: ['read'],
        });
        notification!.read.push(analyst!);
        notification!.save().then(() => {
          resolve(notification);
        });
      });
    });
  }

  static unRead(
    userId: Analyst['id'],
    notificationId: Notification['id'],
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Notification.findOne(notificationId).then((notification) => {
        if (!notification!.read) notification!.read = [];
        notification!.read = notification!.read.filter((analyst) => analyst.id !== userId);
        resolve(notification);
      });
    });
  }

  static toggleRead(
    userId: Analyst['id'],
    notificationId: Notification['id'],
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      Notification.findOne(notificationId, { relations: ['read'] }).then(
        (notification) => {
          const read = notification!.read
            .map((analyst) => analyst.id)
            .includes(userId);
          if (read) resolve(NotificationService.unRead(userId, notificationId));
          resolve(NotificationService.read(userId, notificationId));
        },
      );
    });
  }

  static async readall(userId: Analyst['id']): Promise<Notification[]> {
    const user = await Analyst.findOne(userId, { relations: ['notificationsToMe'] });
    const updates = user!.notificationsToMe.map((notification) => {
      notification.read.push(user!);
      return notification!.save();
    });
    await Promise.all(updates);
    return NotificationService.getAll(userId);
  }

  static async triggerForTicketCreation(newTicket: Ticket): Promise<Notification> {
    const notification = Notification.create();
    notification.name = 'TicketCreate';
    notification.from = newTicket!.openedBy;
    notification.to = newTicket!.group.analysts;
    notification.type = TicketEnum.TICKET_CREATE;
    notification.content = `${newTicket!.openedBy.name} opened a new ticket`;
    return notification.save();
  }

  static async triggerForTicketTransfer(
    ticketId: Ticket['id'],
    groupId: Group['id'],
    analystId: Analyst['id'],
  ): Promise<Notification> {
    const analyst = await AnalystService.getOne(analystId);
    const ticket = await TicketService.getOne(ticketId);
    const group = await Group.findOne(groupId, { relations: ['analysts'] });

    const notification = Notification.create();

    notification.name = 'TicketTransfer';
    notification.from = analyst;
    notification.to = group!.analysts;
    notification.type = TicketEnum.TICKETS_TRANSFER_TO_GROUP;
    // meta: {
    //   ticket
    // },
    notification.content = `${analyst.name} transferiu um chamado para seu grupo`;

    return notification.save();
  }
}

export default NotificationService;
