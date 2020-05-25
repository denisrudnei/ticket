import * as path from 'path'
import http from 'http'
import consola from 'consola'
import connection from '@/server/db/typeormConnection'
import { buildSchema } from 'type-graphql'
import { ApolloServer, PubSub } from 'apollo-server-express'
import { customAuthChecker } from '@/server/authChecker'
import app from '~/server/app'
import TicketService from '~/server/services/ticket/TicketService'
import CheckACL from '~/server/models/CheckACL'
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const pubSub = new PubSub()

async function start() {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*.ts')],
      authChecker: customAuthChecker,
      pubSub: pubSub
    }),
    context: context => ({
      pubSub,
      req: context.req
    }),
    playground: {
      endpoint: '/graphql'
    },
    subscriptions: {
      path: '/subscriptions',
      onConnect: () => {
        consola.info('subscription')
      }
    }
  })
  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)
  server.applyMiddleware({ app })
  await connection
  CheckACL.checkDb((err: Error) => {
    if (err) consola.error(err)
  })

  httpServer.listen(process.env.PORT, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })

  TicketService.startAgenda(pubSub)
}
start()
