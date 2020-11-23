import { Session, SessionData } from 'express-session';
import express from 'express';
import Analyst from '~/server/models/Analyst';

type Content = {
  authUser?: Partial<Analyst>
};

declare module 'express' {
  export interface Request {
    session: Session & Content & Partial<SessionData>
  }
}

export interface CustomExpressContext {
  req: express.Request & Request;
  res: express.Response;
}
