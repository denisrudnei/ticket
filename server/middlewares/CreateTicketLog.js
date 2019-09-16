const LogService = require('../services/ticket/LogService')
const TicketService = require('../services/ticket/TicketService')

async function createTicketLog(req, res, next) {
  const ticket = await TicketService.getOne(req.params.id)
  const user = req.session.authUser._id
  await LogService.createTicketLog(user, ticket)
  next()
}

module.exports = createTicketLog
