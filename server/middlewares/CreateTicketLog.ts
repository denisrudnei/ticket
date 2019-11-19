import LogService  from '../services/ticket/LogService'
import TicketService  from '../services/ticket/TicketService'
import express from 'express'

async function createTicketLog(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ticket = await TicketService.getOne(req.params.id)
  const user = req.session!.authUser._id
  await LogService.createTicketLog(user, ticket)
  next()
}

export default createTicketLog
