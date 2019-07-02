const mongoose = require('mongoose')
const Analyst = require('../models/Analyst')

const AuthService = {
  login(email, password, callback) {
    Analyst.findOne({
      email: email
    })
      .select('+password +email +role')
      .exec((err, user) => {
        if (err) return callback(err, null)
        user.verifyPassword(password, err => {
          return callback(err, user)
        })
      })
  },
  async register(user, callback) {
    const userFromDB = await Analyst.findOne({
      email: user.email
    })

    if (userFromDB) {
      return callback(
        new Error({
          message: 'Usuário já existe'
        }),
        null
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
        callback(err, {
          message: 'sycess'
        })
      }
    )
  },
  mergeUser(email, userBody, callback) {
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
              return callback(err, newAnalyst)
            }
          )
        } else {
          if (analyst.mergePictureWithExternalAccount) {
            analyst.picture = userBody.picture
            analyst.save()
          }
          return callback(err, analyst)
        }
      })
  },
  resetPassword(userId, oldPassword, newPassword, callback) {
    Analyst.findOne({
      _id: userId
    })
      .select('+password')
      .exec((err, user) => {
        if (err) return callback(err, null)
        user.verifyPassword(oldPassword, (err, result) => {
          if (err || !result) {
            return callback(err, {
              message: 'Senha antiga errada'
            })
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
            return callback(err, result)
          })
        })
      })
  }
}

module.exports = AuthService
