const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Analyst = require('../models/Analyst')
const MailService = require('./MailService')

const AuthService = {
  login(email, password) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: email
      })
        .select('+password +email +role')
        .exec((err, user) => {
          if (err) return reject(err)
          if (user === null)
            return reject(new Error('Username or password incorrect'))
          user.verifyPassword(password, err => {
            if (err) return reject(err)
            return resolve(user)
          })
        })
    })
  },
  register(user) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: user.email
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
            err => {
              if (err) return reject(err)
              return resolve({
                message: 'success'
              })
            }
          )
        })
    })
  },
  mergeUser(email, userBody) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: email
      })
        .select('+email +mergePictureWithExternalAccount +role +color')
        .exec((err, analyst) => {
          if (err || analyst === null) {
            Analyst.create(
              {
                _id: new mongoose.Types.ObjectId(),
                ...userBody
              },
              (err, newAnalyst) => {
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
  },
  generateEmailToReset(email, req) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: email
      })
        .select('+email')
        .exec((err, analyst) => {
          if (err) reject(err)
          const token = jwt.sign(
            {
              _id: analyst,
              email: analyst.email
            },
            process.env.JWT_TOKEN
          )
          MailService.sendConfirmationEmail(
            {
              name: analyst.name,
              email: analyst.email
            },
            req,
            token
          )
          resolve(token)
        })
    })
  },
  resetPasswordWithToken(token, newPassword) {
    return new Promise((resolve, reject) => {
      const info = jwt.verify(token, process.env.JWT_TOKEN)
      Analyst.findOne({
        _id: info._id
      }).exec((err, analyst) => {
        if (err) reject(err)
        analyst.newPassword = newPassword
        analyst.save(err => {
          if (err) reject(err)
          resolve()
        })
      })
    })
  },
  resetPassword(userId, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .select('+password')
        .exec((err, user) => {
          if (err) return reject(err)
          user.verifyPassword(oldPassword, (err, result) => {
            if (err || !result) {
              return reject(
                new Error({
                  message: 'Senha antiga errada'
                })
              )
            }
            user.password = newPassword
            user.save(err => {
              if (err) reject(err)
              return resolve()
            })
          })
        })
    })
  }
}

module.exports = AuthService
