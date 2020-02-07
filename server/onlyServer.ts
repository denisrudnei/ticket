import * as path from 'path'
import consola from 'consola'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import { Context } from 'graphql-yoga/dist/types'
import mongoose from 'mongoose'
import app from '~/server/app'
import CheckACL from '~/server/models/CheckACL'
import resolvers from '~/server/resolvers'
import TicketService from '~/server/services/ticket/TicketService'

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/test',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const pubSub = new PubSub()

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schemas.graphql'),
  resolvers,
  context: (req: Context) => ({
    req: req.request,
    pubSub
  })
})

function start() {
  CheckACL.checkDb((err: Error) => {
    if (err) consola.error(err)
  })

  server.express.use(app)

  server.start({
    port: port,
    endpoint: '/api/graphql',
    playground: '/api/playground',
    subscriptions: {
      path: `/api/subscriptions`
    }
  })

  TicketService.startAgenda(pubSub)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
