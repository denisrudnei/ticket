import consola from 'consola'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import { Context } from 'graphql-yoga/dist/types'
import mongoose from 'mongoose'
import morgan from 'morgan'
import * as path from 'path'
import app from '~/server/app'
import CheckACL from '~/server/models/CheckACL'
import resolvers from '~/server/resolvers'

const { Nuxt, Builder } = require('nuxt')
const config = require('~/nuxt.config.js')

mongoose
  .connect(
    process.env.MONGODB_URI || 'mongodb://localhost/test',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    consola.log('Connection to mongodb')
  })
  .catch(() => {
    consola.error('Failed to connect to mongodb')
  })

const pubSub = new PubSub()

config.dev = !(process.env.NODE_ENV === 'production')

const server = new GraphQLServer({
  typeDefs: path.resolve('server/schemas.graphql'),
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
