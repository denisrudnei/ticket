/* eslint-disable import/prefer-default-export */
import { AuthChecker } from 'type-graphql';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export const customAuthChecker: AuthChecker<ExpressContext> = (
  {
    root, args, context, info,
  },
  roles,
) => {
  const { req } = context;
  if (!req!.session!.authUser) return false;
  if (req!.session!.authUser.role.name === 'admin') return true;
  return roles.includes(req!.session!.authUser.role.name);
};
