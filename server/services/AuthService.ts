import jwt from 'jsonwebtoken'
import express from 'express'
import Analyst from '../models/Analyst'
import Role from '../models/Role'
import MailService from './MailService'

class AuthService {
  login(email: string, password: string): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: [
          {
            email: email
          },
          {
            email: email.toLowerCase()
          }
        ],
        relations: ['role']
      }).then(user => {
        if (!user) {
          return reject(new Error('Username or password incorrect'))
        }

        if (!user!.verifyPassword(password))
          return reject(new Error('Incorrect password'))
        return resolve(user)
      })
    })
  }

  register(user: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: [
          {
            email: user.email
          },
          {
            email: user.email.toLowerCase()
          }
        ]
      }).then(async userFromDB => {
        if (userFromDB) return reject(new Error('Already registered'))

        const analyst = new Analyst()
        Object.assign(analyst, user)
        analyst.role = (await Role.findOne({
          name: 'user'
        })) as Role
        analyst.save().then(analyst => {
          resolve(analyst)
        })
      })
    })
  }

  mergeUser(email: string, userBody: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: [
          {
            email: email
          },
          {
            email: email.toLowerCase()
          }
        ],
        relations: ['role']
      }).then(async analyst => {
        if (!analyst) {
          Analyst.create({
            ...userBody,
            email: email,
            role: await Role.findOne({
              name: 'user'
            })
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
        where: [
          {
            email: email
          },
          {
            email: email.toLowerCase()
          }
        ]
      }).then(analyst => {
        if (!analyst) return reject(new Error('Not found'))
        const token = jwt.sign(
          {
            id: analyst!.id,
            email: analyst!.email
          },
          process.env.JWT_TOKEN as string
        )
        MailService.sendConfirmationEmail(analyst!, req, token).catch(reject)
        resolve(token)
      })
    })
  }

  resetPasswordWithToken(token: string, newPassword: string): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      const info = jwt.verify(token, process.env.JWT_TOKEN!) as Analyst
      Analyst.findOne(info.id).then(analyst => {
        analyst!.password = newPassword
        analyst!.save().then(analyst => {
          resolve(analyst)
        })
      })
    })
  }

  resetPassword(
    userId: Analyst['id'],
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(user => {
        const result = user!.verifyPassword(oldPassword)
        if (!result) {
          return reject(new Error('incorrect old password'))
        }
        user!.password = newPassword
        user!.save().then(() => {
          return resolve(true)
        })
      })
    })
  }
}

export default new AuthService()
