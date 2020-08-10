import 'reflect-metadata';
import http from 'http';
import * as path from 'path';
import createConnection from '@/server/db/typeormConnection';
import { ApolloServer, PubSub } from 'apollo-server-express';
import consola from 'consola';
import morgan from 'morgan';
import { buildSchema } from 'type-graphql';
import { customAuthChecker } from './authChecker';
import app from '~/server/app';
import CheckACL from '~/server/models/CheckACL';
import TicketService from '~/server/services/ticket/TicketService';

const { Nuxt, Builder } = require('nuxt');
const config = require('~/nuxt.config.js');

const pubSub = new PubSub();

config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  const nuxt = new Nuxt(config);
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

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000,
  } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    app.use(morgan('dev'));
    await builder.build();
  } else {
    await nuxt.ready();
  }

  await CheckACL.checkDb();

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);
  server.applyMiddleware({ app });
  app.use(nuxt.render);

  httpServer.listen(port, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true,
    });
  });

  TicketService.startAgenda(pubSub);
}
start();
