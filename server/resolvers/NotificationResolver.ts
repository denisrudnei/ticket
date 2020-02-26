import NotificationService from '@/server/services/NotificationService'
import NotificationEnum from '@/server/enums/NotificationEnum'

export default {
  Query: {
    Notification: (_: any, __: any, { req }: any) => {
      return NotificationService.getAll(req.session.authUser._id)
    },
    NotificationById: (_: any, { _id }: any) => {
      return NotificationService.getOne(_id)
    }
  },
  Mutation: {
    ReadNotification: async (_: any, { _id }: any, { req, pubSub }: any) => {
      const userId = req.session.authUser._id
      const notification = await NotificationService.toggleRead(userId, _id)
      pubSub.publish(NotificationEnum.UPDATE_NOTIFICATION, {
        UpdateNotification: notification
      })
      return notification
    },
    ReadAllNotifications: async (_: any, __: any, { req, pubSub }: any) => {
      const userId = req.session.authUser._id
      const notifications = await NotificationService.readall(userId)
      pubSub.publish(NotificationEnum.READ_ALL_NOTIFICATIONS, {
        Notifications: notifications
      })
      return notifications
    }
  },
  Subscription: {
    AddNotification: {
      subscribe: (_: any, __: any, { pubSub }: any) => {
        return pubSub.asyncIterator(NotificationEnum.ADD_NOTIFICATION)
      }
    },
    UpdateNotification: {
      subscribe: (_: any, __: any, { pubSub }: any) => {
        return pubSub.asyncIterator(NotificationEnum.UPDATE_NOTIFICATION)
      }
    },
    Notifications: {
      subscribe: (_: any, __: any, { pubSub }: any) => {
        return pubSub.asyncIterator(NotificationEnum.READ_ALL_NOTIFICATIONS)
      }
    }
  },
  Notification: {
    read: ({ _id }: any) => {
      return NotificationService.getWhoRead(_id)
    }
  }
}
