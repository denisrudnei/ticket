const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const acl = require('express-acl')
const fileUploader = require('express-fileupload')
const compression = require('compression')
const routes = require('./routes/index')

class AppController {
  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(
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

    this.express.use('/api', acl.authorize)

    this.express.use(bodyParser.json())
    this.express.use(compression())
    this.express.use(
      fileUploader({
        limits: {
          fileSize: 10 * 1024 * 1024
        }
      })
    )
  }

  routes() {
    this.express.use('/api', routes)
    this.express.use((err, req, res, next) => {
      consola.error(err)
      res.status(500).json(err.message)
    })
  }
}

module.exports = new AppController().express
