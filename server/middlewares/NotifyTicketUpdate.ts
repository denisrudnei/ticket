import express from 'express';

const NotifyTicketUpdate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  next();
};

export default NotifyTicketUpdate;
