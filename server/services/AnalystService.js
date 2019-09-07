const mongoose = require('mongoose')
const Analyst = require('../../server/models/Analyst')
const S3 = require('../../plugins/S3')

const AnalystService = {
  create(analyst) {
    return new Promise((resolve, reject) => {
      Analyst.create(
        {
          _id: new mongoose.Types.ObjectId(),
          ...analyst
        },
        (err, analyst) => {
          if (err) return reject(err)
          return resolve(analyst)
        }
      )
    })
  },

  getAnalysts() {
    return new Promise((resolve, reject) => {
      Analyst.find({}).exec((err, analysts) => {
        if (err) return reject(err)
        return resolve(analysts)
      })
    })
  },

  getOne(analystId) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: analystId
      }).exec((err, analyst) => {
        if (err) return reject(err)
        return resolve(analyst)
      })
    })
  },

  getConfigAnalysts() {
    return new Promise((resolve, reject) => {
      Analyst.find({})
        .select({
          active: 1,
          emailVisible: 1,
          mergePictureWithExternalAccount: 1,
          role: 1,
          color: 1,
          name: 1
        })
        .exec((err, analysts) => {
          if (err) reject(err)
          return resolve(analysts)
        })
    })
  },

  updateAnalyst(userId, analyst) {
    return new Promise((resolve, reject) => [
      Analyst.updateOne(
        {
          _id: userId
        },
        {
          $set: analyst
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve({
          message: 'success'
        })
      })
    ])
  },

  updateImage(userId, file) {
    return new Promise((resolve, reject) => {
      S3.createBucket(async () => {
        const name = userId
        const params = {
          Bucket: process.env.BUCKET,
          Key: name,
          Body: file.data
        }
        await S3.upload(params, (err, data) => {
          if (err) return reject(err)
          Analyst.updateOne(
            {
              _id: userId
            },
            {
              $set: {
                picture: data.Location
              }
            }
          ).exec(err => {
            if (err) return reject(err)
            return resolve({
              message: 'success'
            })
          })
        })
      })
    })
  },
  setSoundConfig(analystId, config) {
    return Analyst.updateOne(
      {
        _id: analystId
      },
      {
        $set: {
          sounds: {
            chat: {
              muted: config.chat.muted,
              volume: config.chat.volume
            },
            notification: {
              muted: config.notification.muted,
              volume: config.notification.volume
            }
          }
        }
      }
    )
  },

  getGroups(userId) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({ _id: userId }).then(analyst => {
        analyst.getGroups((err, result) => {
          if (err) return reject(err)
          return resolve(result)
        })
      })
    })
  },

  removeImage(userId) {
    return new Promise((resolve, reject) => {
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: userId
        },
        () => {
          Analyst.updateOne(
            {
              _id: userId
            },
            {
              $set: {
                picture: '/user.svg'
              }
            }
          ).exec(err => {
            if (err) return reject(err)
            return resolve({
              message: 'success'
            })
          })
        }
      )
    })
  },

  remove(userId) {
    return new Promise((resolve, reject) => {
      Analyst.findOneAndDelete(
        {
          _id: userId
        },
        (err, _) => {
          if (err) reject(err)
          return resolve({
            message: 'success'
          })
        }
      )
    })
  }
}

module.exports = AnalystService
