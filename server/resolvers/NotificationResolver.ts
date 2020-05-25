import NotificationService from '@/server/services/NotificationService'
import NotificationEnum from '@/server/enums/NotificationEnum'
import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  ID,
  Arg,
  Subscription,
  Root,
  FieldResolver,
  Authorized,
  PubSub,
  PubSubEngine
} from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import Notification from '../models/Notification'
import Analyst from '../models/Analyst'

@Resolver(of => Notification)
class NotificationResolver {
  @Query(() => [Notification])
  @Authorized('user')
  Notification(@Ctx() { req }: ExpressContext) {
    return NotificationService.getAll(req!.session!.authUser.id)
  }

  @Query(() => Notification)
  @Authorized('user')
  NotificationById(@Arg('id', () => ID) id: Notification['id']) {
    return NotificationService.getOne(id)
  }

  @Mutation(() => Notification)
  @Authorized('user')
  async ReadNotification(
    @Arg('id', () => ID) id: Notification['id'],
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine
  ) {
    const userId = req!.session!.authUser.id
    const notification = await NotificationService.toggleRead(userId, id)
    pubSub.publish(NotificationEnum.UPDATE_NOTIFICATION, notification)
    return notification
  }

  @Mutation(() => [Notification])
  @Authorized('user')
  async ReadAllNotifications(
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine
  ) {
    const userId = req!.session!.authUser.id
    const notifications = await NotificationService.readall(userId)
    pubSub.publish(NotificationEnum.READ_ALL_NOTIFICATIONS, notifications)
    return notifications
  }

  @FieldResolver()
  read(@Root() root: Notification): Promise<Analyst[]> {
    return NotificationService.getWhoRead(root.id)
  }

  @Subscription({
    topics: NotificationEnum.ADD_NOTIFICATION
  })
  AddNotification(@Root() notificationPayload: Notification): Notification {
    return notificationPayload
  }

  @Subscription({
    topics: NotificationEnum.UPDATE_NOTIFICATION
  })
  UpdateNotification(@Root() notificationPayload: Notification): Notification {
    return notificationPayload
  }

  @Subscription(() => [Notification], {
    name: 'Notification',
    topics: NotificationEnum.READ_ALL_NOTIFICATIONS
  })
  Notifications(@Root() notificationsPayload: Notification[]): Notification[] {
    return notificationsPayload
  }
}

export default NotificationResolver
