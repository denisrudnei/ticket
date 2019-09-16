const path = require('path')
const consola = require('consola')
const morgan = require('morgan')
const { Nuxt, Builder } = require('nuxt')
const { GraphQLServer } = require('graphql-yoga')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const compression = require('compression')
const fileUploader = require('express-fileupload')
const acl = require('express-acl')
const resolvers = require('./resolvers')
const routes = require('./routes/index')

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schemas.graphql'),
  resolvers
})

server.express.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
  })
)

acl.config({
  filename: 'nacl.json',
  roleSearchPath: 'session.authUser.role'
})

// server.express.use('/api', acl.authorize)

server.express.use(bodyParser.json())

server.express.use(
  fileUploader({
    limits: {
      fileSize: 10 * 1024 * 1024
    }
  })
)

server.express.use(compression())

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/test',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const CheckACL = require('./models/CheckACL')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
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

  server.express.use('/api', routes)
 

  server.express.use((err, req, res, next) => {
    consola.error(err)
    res.status(500).json(err.message)
  })

  server.start({
    port: port,
    endpoint: '/graphql',
    playground: '/playground'
  })

  server.express.use(nuxt.render)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
