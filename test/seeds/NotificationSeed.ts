import { DeleteResult } from 'typeorm'
import Notification from '../../server/models/Notification'
import Generate from './Generate'
import AnalystSeed from './AnalystSeed'
import Seed from './Seed'
import Analyst from '~/server/models/Analyst'

class NotificationSeed implements Seed<Notification> {
  init(): Promise<Notification> {
    return new Promise((resolve, reject) => {
      new AnalystSeed().init().then((analyst: Analyst) => {
        const notification = new Notification()
        notification.name = 'notification'
        notification.content = 'Notification created'
        notification.type = 'type'
        notification.to = [analyst!]
        notification.from = analyst!

        resolve(Notification.create(notification).save())
      })
    })
  }

  generateMany(number: number): Promise<Notification[]> {
    return Generate.many<NotificationSeed>(new NotificationSeed(), number)
  }

  destroy(): Promise<DeleteResult> {
    return Notification.delete({})
  }
}

export default NotificationSeed
