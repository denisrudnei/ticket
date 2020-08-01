import NotificationService from '../../server/services/NotificationService';
import Notification from '../../server/models/Notification';
import Analyst from '../../server/models/Analyst';
import Ticket from '../../server/models/ticket/Ticket';
import Group from '../../server/models/ticket/Group';

describe('NotificationService', () => {
  it('Get all notifications', async () => {
    const user = await Analyst.findOne();
    await NotificationService.getAll(user!.id);
  });

  it('Get one notification', async () => {
    const notification = await Notification.findOne();
    await NotificationService.getOne(notification!.id);
  });

  it('Toggle notification status', async () => {
    const user = await Analyst.findOne();
    const notification = await Notification.findOne();
    await NotificationService.toggleRead(user!.id, notification!.id);
    await NotificationService.toggleRead(user!.id, notification!.id);
  });

  it('Should read a notification', async () => {
    const user = await Analyst.findOne();
    const notification = await Notification.findOne();
    await NotificationService.read(user!.id, notification!.id);
  });

  it('Should unread a notification', async () => {
    const user = await Analyst.findOne();
    const notification = await Notification.findOne();
    await NotificationService.unRead(user!.id, notification!.id);
  });

  it('Should Trigger a new notification', async () => {
    const ticket = await Ticket.findOne({});
    const group = await Group.findOne({});
    const analyst = await Analyst.findOne({});
    await NotificationService.triggerForTicketTransfer(
      ticket!.id,
      group!.id,
      analyst!.id,
    );
  });

  it('Should return who reads the notification', async () => {
    const notification = await Notification.findOne();
    await NotificationService.getWhoRead(notification!.id);
  });

  it('Should trigger a new notification', async () => {
    const analyst = await Analyst.findOne();
    const group = await Group.findOne();
    const ticket = {
      openedBy: analyst!,
      group,
    } as Ticket;
    await NotificationService.triggerForTicketCreation(ticket);
  });

  it('Should read all notifications', async () => {
    const user = await Analyst.findOne();
    await NotificationService.readall(user!.id);
  });
});
