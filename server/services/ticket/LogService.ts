const { Types } = require('mongoose')
const Log = require('../../models/ticket/Log')
const Ticket = require('../../models/ticket/Ticket')

const LogService = {
  createTicketLog(actualUser, ticket) {
    return new Promise((resolve, reject) => {
      Log.create(
        {
          _id: new Types.ObjectId(),
          oldStatus: ticket.status,
          date: new Date(),
          user: actualUser,
          group: ticket.group
        },
        (err, log) => {
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
          ).exec(err => {
            if (err) reject(err)
            resolve()
          })
        }
      )
    })
  }
}

module.exports = LogService
