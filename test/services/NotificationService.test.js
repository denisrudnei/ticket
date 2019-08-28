const NotificationService = require('../../server/services/NotificationService')
const Notification = require('../../server/models/Notification')
const Analyst = require('../../server/models/Analyst')

describe('NotificationService', function() {
  this.timeout(0)

  it('Get all notifications', async () => {
    const user = await Analyst.findOne().exec()
    await NotificationService.getAll(user._id)
  })

  it('Get one notification', async () => {
    const user = await Analyst.findOne().exec()
    const notification = await Notification.findOne().exec()
    await NotificationService.getOne(user._id, notification._id)
  })

  it('Toggle notification status', async () => {
    const user = await Analyst.findOne().exec()
    const notification = await Notification.findOne().exec()
    await NotificationService.toggleRead(user._id, notification._id)
    await NotificationService.toggleRead(user._id, notification._id)
  })

  it('Read notification', async () => {
    const user = await Analyst.findOne().exec()
    const notification = await Notification.findOne().exec()
    await NotificationService.read(user._id, notification._id)
  })

  it('Unread notification', async () => {
    const user = await Analyst.findOne().exec()
    const notification = await Notification.findOne().exec()
    await NotificationService.unRead(user._id, notification._id)
  })
})
