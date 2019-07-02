const mongoose = require('mongoose')
const Analyst = require('../../server/models/Analyst')
const S3 = require('../../plugins/S3')

const AnalystService = {
  create(analyst, callback) {
    Analyst.create(
      {
        _id: new mongoose.Types.ObjectId(),
        ...analyst
      },
      (err, analyst) => {
        callback(err, analyst)
      }
    )
  },

  getAnalysts(callback) {
    Analyst.find({}).exec((err, analysts) => {
      return callback(err, analysts)
    })
  },

  getConfigAnalysts(callback) {
    Analyst.find({})
      .select({
        active: 1,
        emailVisible: 1,
        mergePictureWithExternalAccount: 1,
        role: 1,
        color: 1
      })
      .exec((err, analysts) => {
        return callback(err, analysts)
      })
  },

  updateAnalyst(userId, analyst, callback) {
    Analyst.updateOne(
      {
        _id: userId
      },
      {
        $set: analyst
      }
    ).exec(err => {
      return callback(err, {
        message: 'success'
      })
    })
  },

  updateImage(userId, file, callback) {
    S3.createBucket(async () => {
      const name = userId
      const params = {
        Bucket: process.env.BUCKET,
        Key: name,
        Body: file.data
      }
      await S3.upload(params, (err, data) => {
        if (err) return callback(err, null)
        Analyst.findOneAndUpdate(
          {
            _id: userId
          },
          {
            $set: {
              picture: data.Location
            }
          }
        ).exec(err => {
          return callback(err, {
            message: 'success'
          })
        })
      })
    })
  },

  async getGroups(userId, callback) {
    const analyst = await Analyst.findOne({ _id: userId })

    analyst.getGroups((err, result) => {
      callback(err, result)
    })
  },

  removeImage(userId, callback) {
    S3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: userId
      },
      () => {
        Analyst.findOneAndUpdate(
          {
            _id: userId
          },
          {
            $set: {
              picture: '/user.svg'
            }
          }
        ).exec(err => {
          return callback(err, {
            message: 'success'
          })
        })
      }
    )
  },

  remove(userId, callback) {
    Analyst.findOneAndDelete(
      {
        _id: userId
      },
      (err, _) => {
        return callback(err, {
          message: 'success'
        })
      }
    )
  }
}

module.exports = AnalystService
