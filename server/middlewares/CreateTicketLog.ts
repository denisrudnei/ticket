import express from 'express'
import LogService from '../services/ticket/LogService'
import TicketService from '../services/ticket/TicketService'

async function createTicketLog(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const ticket = await TicketService.getOne(parseInt(req.params.id))
  const user = req.session!.authUser.id
  await LogService.createTicketLog(user, ticket.id)
  next()
}

export default createTicketLog
