const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const server = require('http').createServer(app)
const apiRouter = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const io = require('socket.io')(server)
const session = require('express-session')
const compression = require('compression')
const fileUploader = require('express-fileupload')
const acl = require('express-acl')

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
  })
)

acl.config({
  filename: 'nacl.json',
  defaultRole: 'user'
})

app.use(bodyParser.json())

app.use(
  fileUploader({
    limits: {
      fileSize: 10 * 1024 * 1024
    }
  })
)

app.use(compression())

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/test',
  { useNewUrlParser: true }
)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
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
    await builder.build()
  } else {
    await nuxt.ready()
  }

  require('./controllers/AuthController')(apiRouter)
  require('./controllers/TicketController')(apiRouter, io)
  require('./controllers/AnalystController')(apiRouter)
  require('./controllers/CategoryController')(apiRouter)
  require('./controllers/GroupController')(apiRouter)
  require('./controllers/StatusController')(apiRouter)
  require('./controllers/SearchController')(apiRouter)
  require('./controllers/NotificationController')(apiRouter, io)
  require('./controllers/ChatController')(apiRouter, io)
  app.use('/api', apiRouter)

  apiRouter.use(acl.authorize)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  // app.listen(port, host)
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
