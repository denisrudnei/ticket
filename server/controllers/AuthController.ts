import jsonwebtoken  from 'jsonwebtoken'
import AuthService  from '../services/AuthService'
import express from 'express'
import Analyst from '../models/Analyst'

export default {
  login: (req: express.Request, res: express.Response) => {
    AuthService.login(req.body.email, req.body.password)
      .then(result => {
        req.session!.authUser = result
        const response = jsonwebtoken.sign(
          JSON.stringify(result),
          process.env.JWT_TOKEN as string
        )
        return res.json({
          user: response
        })
      })
      .catch(() => {
        return res.sendStatus(400)
      })
  },

  getUser: (req: express.Request, res: express.Response) => {
    res.json({
      user: req.session!.authUser
    })
  },

  logout: (req: express.Request, res: express.Response) => {
    delete req.session!.authUser
    res.sendStatus(200)
  },

  register: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new Analyst({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    AuthService.register(user)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(next)
  },

  mergeUser: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    AuthService.mergeUser(req.body.email, req.body)
      .then(result => {
        req.session!.authUser = result
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        next(e)
      })
  },

  redefinePassword: (req: express.Request, res: express.Response) => {
    const user = req.body
    AuthService.generateEmailToReset(user.email, req)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch((err: Error) => {
        return res.status(500).json(err)
      })
  },

  resetWithToken: (req: express.Request, res: express.Response) => {
    const user = req.body
    const token = req.params.token
    AuthService.resetPasswordWithToken(token, user.password)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch((err: Error) => {
        return res.status(500).json(err)
      })
  },

  reset: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    AuthService.resetPassword(
      userId,
      req.body.oldPassword,
      req.body.newPassword
    )
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(400).json({
          message: 'Senha antiga errada'
        })
      })
  }
}
