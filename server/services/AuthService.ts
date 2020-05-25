import jwt from 'jsonwebtoken'
import express from 'express'
import Analyst from '../models/Analyst'
import MailService from './MailService'

class AuthService {
  login(email: string, password: string): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (!user) {
          return reject(new Error('Username or password incorrect'))
        }

        user!.verifyPassword(password, (err: Error) => {
          if (err) return reject(err)
          return resolve(user)
        })
      })
    })
  }

  register(user: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: user.email
      }).then(userFromDB => {
        if (userFromDB) return reject(new Error('Already registered'))

        const analyst = new Analyst()
        Object.assign(analyst, user)

        analyst.save().then(analyst => {
          resolve(analyst)
        })
      })
    })
  }

  mergeUser(email: string, userBody: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: email
      }).then(analyst => {
        if (!analyst) {
          Analyst.create({
            ...userBody,
            email: email
          })
            .save()
            .then(newAnalyst => {
              return resolve(newAnalyst)
            })
        } else {
          if (analyst!.mergePictureWithExternalAccount) {
            analyst!.picture = userBody.picture
            analyst!.save()
          }
          return resolve(analyst)
        }
      })
    })
  }

  generateEmailToReset(email: string, req: express.Request): Promise<string> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: {
          email: email
        }
      }).then(analyst => {
        if (!analyst) return reject(new Error('Not found'))
        const token = jwt.sign(
          {
            id: analyst!.id,
            email: analyst!.email
          },
          process.env.JWT_TOKEN as string
        )
        MailService.sendConfirmationEmail(analyst!, req, token)
        resolve(token)
      })
    })
  }

  resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const info = jwt.verify(token, process.env.JWT_TOKEN!) as Analyst
      Analyst.findOne(info.id).then(analyst => {
        analyst!.password = newPassword
        analyst!.save().then(() => {
          resolve()
        })
      })
    })
  }

  resetPassword(
    userId: Analyst['id'],
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(user => {
        user!.verifyPassword(oldPassword, (err: Error, result: boolean) => {
          if (err || !result) {
            return reject(new Error('incorrect old password'))
          }
          user!.password = newPassword
          user!.save().then(() => {
            return resolve()
          })
        })
      })
    })
  }
}

export default new AuthService()
