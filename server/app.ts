import express from 'express'
import session from 'express-session'
import consola from 'consola'
import bodyParser from 'body-parser'
import compression from 'compression'
import acl from 'express-acl'
import fileUploader from 'express-fileupload'
import routes from '~/server/routes/index'

class AppController {
  express: express.Application

  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(bodyParser.json())
    this.express.use(compression())
    this.express.use(
      session({
        secret: process.env.SESSION_KEY as string,
        resave: false,
        saveUninitialized: false
      })
    )
    acl.config({
      baseUrl: '',
      filename: 'nacl.json',
      roleSearchPath: 'session.authUser.role.name'
    })
    this.express.use('/api', acl.authorize)
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
    this.express.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        consola.error(err)
        res.status(500).json(err.message)
      }
    )
  }
}

export default new AppController().express
