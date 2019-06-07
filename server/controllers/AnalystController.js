const mongoose = require('mongoose')
const Analyst = require('../models/Analyst')
const S3 = require('../../plugins/S3')

module.exports = app => {
  app.get('/analyst', (req, res) => {
    Analyst.find({})
      .select({
        password: 0
      })
      .exec((err, analysts) => {
        if (err || analysts === null) return res.status(500).json(err)
        return res.status(200).json(analysts)
      })
  })

  app.post('/config/analyst', (req, res) => {
    const analyst = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    Analyst.create(analyst, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(200)
    })
  })

  app.post('/analyst/:id/groups', async (req, res) => {
    const analyst = await Analyst.findOne({ _id: req.params.id })

    analyst.getGroups((err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.put('/analyst', (req, res) => {
    Analyst.updateOne(
      {
        _id: req.session.authUser._id
      },
      {
        $set: {
          name: req.body.name,
          contactEmail: req.body.contactEmail,
          color: req.body.color,
          mergePictureWithExternalAccount:
            req.body.mergePictureWithExternalAccount
        }
      }
    ).exec(err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(202)
    })
  })

  app.put('/analyst/image', (req, res) => {
    S3.createBucket(async () => {
      const file = req.files.image
      const name = req.session.authUser._id
      const params = {
        Bucket: process.env.BUCKET,
        Key: name,
        Body: file.data
      }
      await S3.upload(params, (err, data) => {
        if (err) return res.status(500).json(err)
        Analyst.findOneAndUpdate(
          {
            _id: req.session.authUser._id
          },
          {
            $set: {
              picture: data.Location
            }
          }
        ).exec(err => {
          if (err) return res.status(500).json(err)
          return res.sendStatus(202)
        })
      })
    })
  })

  app.delete('/analyst/image', (req, res) => {
    S3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: req.session.authUser._id
      },
      () => {
        Analyst.findOneAndUpdate(
          {
            _id: req.session.authUser._id
          },
          {
            $set: {
              picture: '/user.svg'
            }
          }
        ).exec(err => {
          if (err) return res.status(500).json(err)
          return res.sendStatus(202)
        })
      }
    )
  })

  app.delete('/analyst/:id', (req, res) => {
    Analyst.findOneAndDelete(
      {
        _id: req.params.id
      },
      (err, result) => {
        if (err) return res.status(500).json(err)
        return res.sendStatus(200)
      }
    )
  })
}
