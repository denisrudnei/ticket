const path = require('path')
const consola = require('consola')
const morgan = require('morgan')
const { Nuxt, Builder } = require('nuxt')
const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/test',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const config = require('../nuxt.config.js')
const resolvers = require('./resolvers')
const CheckACL = require('./models/CheckACL')
config.dev = !(process.env.NODE_ENV === 'production')

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schemas.graphql'),
  resolvers
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

  CheckACL.checkDb(err => {
    if (err) consola.error(err)
  })

  server.express.use(app)

  server.start({
    port: port,
    endpoint: '/api/graphql',
    playground: '/api/playground'
  })

  server.express.use(nuxt.render)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
