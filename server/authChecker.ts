/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { CustomExpressContext } from '~/server/types/UserSession';

import Analyst from './models/Analyst';
import Role from './models/Role';

export const customAuthChecker: AuthChecker<CustomExpressContext> = ({
  root,
  args,
  context,
  info,
}, roles) => {
  const { req } = context;
  const { session } = req;
  if (!req.headers.authorization && !session!.authUser) return false;
  if (session && session.authUser) {
    const user = req.session.authUser!;
    if (user.role.name === 'admin') return true;
    return roles.includes(user.role.name);
  }

  return false;
};

export default customAuthChecker;
