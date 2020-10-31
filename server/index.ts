import 'reflect-metadata';

import createConnection from '@/server/db/typeormConnection';
import { ApolloServer, PubSub } from 'apollo-server-express';
import consola from 'consola';
import http from 'http';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import app from '~/server/app';
import CheckACL from '~/server/models/CheckACL';
import TicketService from '~/server/services/ticket/TicketService';

import { customAuthChecker } from './authChecker';

const pubSub = new PubSub();

async function start() {
  await createConnection;
  const server = new ApolloServer({
    introspection: true,
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*')],
      authChecker: customAuthChecker,
      pubSub,
    }),
    uploads: {
      maxFiles: 20,
    },
    playground: {
      endpoint: '/graphql',
    },
    subscriptions: {
      path: '/subscriptions',
    },
    context: (context) => ({
      req: context.req,
      pubSub,
    }),
  });

  await CheckACL.checkDb();

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);
  server.applyMiddleware({ app });

  const { PORT, HOST } = process.env;

  httpServer.listen(PORT, () => {
    consola.ready({
      message: `Server listening on http://${HOST}:${PORT}`,
      badge: true,
    });
  });

  TicketService.startAgenda(pubSub);
}
start();
