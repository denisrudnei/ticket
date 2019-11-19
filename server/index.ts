import * as path from 'path'
import consola from 'consola'
import morgan from 'morgan'
const { Nuxt, Builder } = require('nuxt')
import { GraphQLServer, PubSub } from 'graphql-yoga'
import mongoose from 'mongoose'
import { Context } from 'graphql-yoga/dist/types'

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/test',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const pubSub = new PubSub()

const config = require('../nuxt.config.js')
const app = require('./app')
const resolvers = require('./resolvers/index')
const CheckACL = require('./models/CheckACL')
config.dev = !(process.env.NODE_ENV === 'production')

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schemas.graphql'),
  resolvers,
  context: async (req: Context) => ({
    req: req.request,
    pubSub
  })
})

async function start() {
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    server.express.use(morgan('dev'))
    await builder.build()
  } else {
    await nuxt.ready()
  }

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

  server.express.use(nuxt.render)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
