const NotifyTicketUpdate = (req, res, next) => {
  // io.emit('notifyTicketUpdate', {
  //   user: req.session.authUser._id,
  //   ticket: req.params.id
  // })
  next()
}

module.exports = NotifyTicketUpdate
