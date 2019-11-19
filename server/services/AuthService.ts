import mongoose, {Types} from 'mongoose'
import jwt from 'jsonwebtoken'
import Analyst, {IAnalyst} from '../models/Analyst'
import MailService from './MailService'
import express from 'express'

class AuthService {
  login(email: string, password: string): Promise<IAnalyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: {
          $regex: new RegExp(`^${email}$`, 'i')
        }
      })
        .select('+password +email +role')
        .exec((err: Error, user) => {
          if (err) return reject(err)
          if (user === null)
            return reject(new Error('Username or password incorrect'))
          user.verifyPassword(password, (err: Error) => {
            if (err) return reject(err)
            return resolve(user)
          })
        })
    })
  }
  register(user: IAnalyst): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: {
          $regex: new RegExp(`^${user.email}$`, 'i')
        }
      })
        .exec()
        .then(userFromDB => {
          if (userFromDB) {
            return reject(new Error('Usuário já existe'))
          }
        })
        .then(() => {
          Analyst.create(
            {
              _id: new mongoose.Types.ObjectId(),
              email: user.email,
              name: user.name,
              password: user.password
            },
            (err: Error) => {
              if (err) return reject(err)
              return resolve()
            }
          )
        })
    })
  }
  mergeUser(email: string, userBody: IAnalyst): Promise<IAnalyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: {
          $regex: new RegExp(`^${email}$`, 'i')
        }
      })
        .select('+email +mergePictureWithExternalAccount +role +color +address')
        .populate(['address'])
        .exec((err: Error, analyst) => {
          if (err || analyst === null) {
            Analyst.create(
              {
                _id: new mongoose.Types.ObjectId(),
                ...userBody
              },
              (err: Error, newAnalyst: IAnalyst) => {
                if (err) return reject(err)
                return resolve(newAnalyst)
              }
            )
          } else {
            if (analyst.mergePictureWithExternalAccount) {
              analyst.picture = userBody.picture
              analyst.save()
            }
            return resolve(analyst)
          }
        })
    })
  }
  generateEmailToReset(email: string, req: express.Request): Promise<string> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: email
      })
        .select('+email')
        .exec((err: Error, analyst) => {
          if (err) return reject(err)
          if (analyst === null)
            return reject(
              new Error('Not found')
            )
          const token = jwt.sign(
            {
              _id: analyst._id,
              email: analyst.email
            },
            process.env.JWT_TOKEN as string
          )
          MailService.sendConfirmationEmail(
            new Analyst({
              name: analyst.name,
              email: analyst.email
            }),
            req,
            token
          )
          resolve(token)
        })
    })
  }
  resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const info = jwt.verify(token, process.env.JWT_TOKEN as string) as IAnalyst
      Analyst.findOne({
        _id: info._id
      }).exec((err: Error, analyst) => {
        if (err) reject(err)
        analyst.password = newPassword
        analyst.save((err: Error) => {
          if (err) reject(err)
          resolve()
        })
      })
    })
  }
  resetPassword(userId: Types.ObjectId, oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .select('+password')
        .exec((err: Error, user) => {
          if (err) return reject(err)
          user.verifyPassword(oldPassword, (err: Error, result: boolean) => {
            if (err || !result) {
              return reject(
                new Error('Senha antiga errada')
              )
            }
            user.password = newPassword
            user.save((err: Error) => {
              if (err) reject(err)
              return resolve()
            })
          })
        })
    })
  }
}

export default new AuthService()
