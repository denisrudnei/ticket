import Log from '../../models/ticket/Log'
import Ticket from '../../models/ticket/Ticket'
import Analyst from '../../models/Analyst'

class LogService {
  createTicketLog(
    actualUser: Analyst['id'],
    ticketId: Ticket['id']
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(actualUser).then(async analyst => {
        const log = new Log()
        const ticket = await Ticket.findOne(ticketId, { relations: ['logs'] })

        log.oldStatus = ticket!.status
        log.date = new Date()
        log.user = analyst!
        log.group = ticket!.group
        Log.create(log)
          .save()
          .then(log => {
            ticket!.logs.push(log)
            ticket!.save().then(() => {
              resolve()
            })
          })
      })
    })
  }
}

export default new LogService()
