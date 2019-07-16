const mongoose = require('mongoose')
const Analyst = require('../models/Analyst')

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
    return new Promise(async (resolve, reject) => {
      const userFromDB = await Analyst.findOne({
        email: user.email
      })

      if (userFromDB) {
        return reject(
          new Error({
            message: 'Usuário já existe'
          })
        )
      }

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
  },
  mergeUser(email, userBody) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        email: email
      })
        .select('+email +mergePictureWithExternalAccount +role +color')
        .exec(async (err, analyst) => {
          if (err || analyst === null) {
            await Analyst.create(
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
            Analyst.updateOne(
              {
                _id: userId
              },
              {
                $set: {
                  password: newPassword
                }
              }
            ).exec((err, result) => {
              if (err) reject(err)
              return resolve(result)
            })
          })
        })
    })
  }
}

module.exports = AuthService
