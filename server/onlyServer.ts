import * as path from 'path'
import consola from 'consola'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import mongoose from 'mongoose'
import { Context } from 'graphql-yoga/dist/types'
import app from './app'
import resolvers from './resolvers/index'
import CheckACL from './models/CheckACL'

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
  context: async (req: Context) => ({
    req: req.request,
    pubSub
  })
})

async function start() {
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

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
