import NotificationService from '@/server/services/NotificationService'

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
    ReadNotification: (_: any, { _id }: any, { req }: any) => {
      const userId = req.session.authUser._id
      return NotificationService.toggleRead(userId, _id)
    },
    ReadAllNotifications: (_: any, __: any, { req }: any) => {
      const userId = req.session.authUser._id
      return NotificationService.readall(userId)
    }
  },
  Notification: {
    read: ({ _id }: any) => {
      return NotificationService.getWhoRead(_id)
    }
  }
}
