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
  roleSearchPath: 'session.authUser.role'
})

apiRouter.use(acl.authorize)

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
    await builder.build()
  } else {
    await nuxt.ready()
  }

  CheckACL.checkDb(err => {
    if (err) consola.error(err)
  })

  require('./controllers/AuthController')(apiRouter)
  require('./controllers/AddressController')(apiRouter)
  require('./controllers/ProfileController')(apiRouter, io)
  require('./controllers/ticket/TicketController')(apiRouter, io)
  require('./controllers/AnalystController')(apiRouter)
  require('./controllers/RoleController')(apiRouter)
  require('./controllers/ticket/CategoryController')(apiRouter)
  require('./controllers/ticket/GroupController')(apiRouter)
  require('./controllers/ticket/StatusController')(apiRouter)
  require('./controllers/ticket/SearchController')(apiRouter)
  require('./controllers/NotificationController')(apiRouter, io)
  require('./controllers/ChatController')(apiRouter, io)
  require('./controllers/knowledge/KnowledgeController')(apiRouter)
  require('./controllers/knowledge/KnowledgeStatusController')(apiRouter)
  app.use('/api', apiRouter)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
