import express from 'express'
const NotifyTicketUpdate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // io.emit('notifyTicketUpdate', {
  //   user: req.session.authUser._id,
  //   ticket: req.params.id
  // })
  next()
}

export default NotifyTicketUpdate
