/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { CustomExpressContext } from '~/server/types/UserSession';

import Analyst from './models/Analyst';

export const customAuthChecker: AuthChecker<CustomExpressContext> = ({
  root,
  args,
  context,
  info,
}) => {
  const { req } = context;
  const { session } = req;
  if (!req.headers.authorization && !session!.authUser) return false;
  if (session && session.authUser) return true;
  const items = req.headers.authorization!.split(' ');
  const token = items[items.length - 1];

  const data = jwt.decode(token) as Analyst;

  req.session!.authUser = data;

  return true;
};

export default customAuthChecker;
