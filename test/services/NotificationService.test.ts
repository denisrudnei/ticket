import NotificationService from '../../server/services/NotificationService'
import Notification from '../../server/models/Notification'
import Analyst from '../../server/models/Analyst'
import Ticket from '../../server/models/ticket/Ticket'
import Group from '../../server/models/ticket/Group'
import 'mocha'

describe('NotificationService', function() {
  this.timeout(0)

  it('Get all notifications', async () => {
    const user = await Analyst.findOne().exec()
    await NotificationService.getAll(user._id)
  })

  it('Get one notification', async () => {
    const notification = await Notification.findOne().exec()
    await NotificationService.getOne(notification._id)
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

  it('Trigger a notification', async () => {
    const ticket = await Ticket.findOne({}).exec()
    const group = await Group.findOne({}).exec()
    console.log(group)
    const analyst = await Analyst.findOne({}).exec()
    await NotificationService.triggerForTicketTransfer(
      ticket!._id,
      group._id,
      analyst._id
    )
  })

  it('Read all notifications', async () => {
    const user = await Analyst.findOne().exec()
    await NotificationService.readall(user._id)
  })
})
