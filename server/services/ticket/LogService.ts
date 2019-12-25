import { Types } from 'mongoose'
import Log, { ILog } from '../../models/ticket/Log'
import Ticket, { ITicket } from '../../models/ticket/Ticket'
import { IAnalyst } from '../../models/Analyst'

class LogService {
  createTicketLog(actualUser: IAnalyst['_id'], ticket: ITicket): Promise<void> {
    return new Promise((resolve, reject) => {
      Log.create(
        {
          _id: new Types.ObjectId(),
          oldStatus: ticket.status,
          date: new Date(),
          user: actualUser,
          group: ticket.group
        },
        (err: Error, log: ILog) => {
          if (err) reject(err)
          Ticket.updateOne(
            {
              _id: ticket._id
            },
            {
              $addToSet: {
                logs: [log]
              }
            }
          ).exec((err: Error) => {
            if (err) reject(err)
            resolve()
          })
        }
      )
    })
  }
}

export default new LogService()
