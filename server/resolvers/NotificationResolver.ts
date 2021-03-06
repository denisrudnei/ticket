/* eslint-disable class-methods-use-this */
import NotificationEnum from '@/server/enums/NotificationEnum';
import NotificationService from '@/server/services/NotificationService';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { CustomExpressContext } from '~/server/types/UserSession';

import Analyst from '../models/Analyst';
import Notification from '../models/Notification';

@Resolver((of) => Notification)
class NotificationResolver {
  @Query(() => [Notification])
  @Authorized('user')
  Notification(@Ctx() { req }: CustomExpressContext) {
    return NotificationService.getAll(req!.session!.authUser!.id);
  }

  @Query(() => Notification)
  @Authorized('user')
  NotificationById(@Arg('id', () => ID) id: Notification['id']) {
    return NotificationService.getOne(id);
  }

  @Mutation(() => Notification)
  @Authorized('user')
  async ReadNotification(
    @Arg('id', () => ID) id: Notification['id'],
    @Ctx() { req }: CustomExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const userId = req!.session!.authUser!.id;
    const notification = await NotificationService.toggleRead(userId, id);
    pubSub.publish(NotificationEnum.UPDATE_NOTIFICATION, notification);
    return notification;
  }

  @Mutation(() => [Notification])
  @Authorized('user')
  async ReadAllNotifications(
    @Ctx() { req }: CustomExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const userId = req!.session!.authUser!.id;
    const notifications = await NotificationService.readall(userId);
    pubSub.publish(NotificationEnum.READ_ALL_NOTIFICATIONS, notifications);
    return notifications;
  }

  @FieldResolver()
  read(@Root() root: Notification): Promise<Analyst[]> {
    return NotificationService.getWhoRead(root.id);
  }

  @FieldResolver()
  async to(@Root() root: Notification): Promise<Analyst[]> {
    const { to } = (await Notification.findOne(root.id, { relations: ['to'] }) as Notification);
    return to;
  }

  @FieldResolver()
  async from(@Root() root: Notification): Promise<Analyst> {
    const { from } = (await Notification.findOne(root.id, { relations: ['from'] }) as Notification);
    return from;
  }

  @Subscription({
    topics: NotificationEnum.ADD_NOTIFICATION,
  })
  AddNotification(@Root() notificationPayload: Notification): Notification {
    return notificationPayload;
  }

  @Subscription({
    topics: NotificationEnum.UPDATE_NOTIFICATION,
  })
  UpdateNotification(@Root() notificationPayload: Notification): Notification {
    return notificationPayload;
  }

  @Subscription(() => [Notification], {
    name: 'Notification',
    topics: NotificationEnum.READ_ALL_NOTIFICATIONS,
  })
  Notifications(@Root() notificationsPayload: Notification[]): Notification[] {
    return notificationsPayload;
  }
}

export default NotificationResolver;
