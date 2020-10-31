/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';

export const customAuthChecker: AuthChecker<ExpressContext> = ({
  root,
  args,
  context,
  info,
}) => {
  const { req } = context;
  const { session } = req;
  if (!req.headers.authorization && !req.session!.authUser) return false;
  if (session && session.authUser) return true;
  const items = req.headers.authorization!.split(' ');
  const token = items[items.length - 1];

  const data = jwt.decode(token);

  req.session!.authUser = data;

  return true;
};

export default customAuthChecker;
