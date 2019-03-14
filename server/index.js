const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const apiRouter = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

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

  app.use(bodyParser.json())

  require('./controllers/TicketController')(apiRouter, io)
  require('./controllers/AnalystController')(apiRouter)
  require('./controllers/CategoryController')(apiRouter)
  require('./controllers/GroupController')(apiRouter)
  require('./controllers/StatusController')(apiRouter)
  require('./controllers/SearchController')(apiRouter)
  require('./controllers/NotificationController')(apiRouter)
  app.use('/api', apiRouter)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  //app.listen(port, host)
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
